import '../data/catalog_store.dart';
import '../models/cart_item.dart';
import '../models/product.dart';
import '../models/pricing.dart';
import 'view_result.dart';

/// Item do carrinho já conferido contra o catálogo.
class PricedItem {
  final Product product;
  final int quantity;
  const PricedItem(this.product, this.quantity);
  int get subtotalCents => product.priceCents * quantity;
}

/// Resultado de uma validação bem-sucedida.
class CartValidation {
  final List<PricedItem> items;
  const CartValidation(this.items);
  int get subtotalCents => items.fold(0, (sum, i) => sum + i.subtotalCents);
  int get itemCount => items.fold(0, (sum, i) => sum + i.quantity);
}

/// Caso de uso `POST /cart/validate`: confere se todo item existe e tem estoque.
class CartViewModel {
  final CatalogStore catalog;
  CartViewModel(this.catalog);

  /// Lê `{ items: [{ productId, qty }] }`. Itens repetidos são somados.
  static ViewResult<List<CartItemRequest>> parseItems(Object? body) {
    if (body is! Map || body['items'] is! List) {
      return badRequest('Envie { "items": [{ "productId": 1, "qty": 2 }] }.');
    }
    final raw = body['items'] as List;
    if (raw.isEmpty) return badRequest('O carrinho está vazio.');

    final merged = <int, int>{};
    for (final entry in raw) {
      final item = CartItemRequest.fromJson(entry);
      if (item == null) {
        return badRequest('Cada item precisa de "productId" (inteiro) e "qty" (inteiro maior que zero).');
      }
      merged[item.productId] = (merged[item.productId] ?? 0) + item.quantity;
    }
    return Success([
      for (final e in merged.entries) CartItemRequest(productId: e.key, quantity: e.value),
    ]);
  }

  /// Confere estoque. Falha com 409 e a lista de itens indisponíveis.
  ViewResult<CartValidation> check(List<CartItemRequest> items) {
    final priced = <PricedItem>[];
    final unavailable = <UnavailableItem>[];

    for (final item in items) {
      final product = catalog.findById(item.productId);
      if (product == null) {
        unavailable.add(UnavailableItem(
          productId: item.productId, name: null,
          requested: item.quantity, available: 0, reason: 'not_found',
        ));
      } else if (!product.hasStock(item.quantity)) {
        unavailable.add(UnavailableItem(
          productId: product.id, name: product.name,
          requested: item.quantity, available: product.stock, reason: 'insufficient_stock',
        ));
      } else {
        priced.add(PricedItem(product, item.quantity));
      }
    }

    if (unavailable.isNotEmpty) {
      return Failure(409, 'stock_unavailable',
          'Alguns itens não estão disponíveis na quantidade pedida.', details: unavailable);
    }
    return Success(CartValidation(priced));
  }

  ViewResult<CartValidation> validate(Object? body) {
    final parsed = parseItems(body);
    return switch (parsed) {
      Success(:final data) => check(data),
      Failure() => parsed.cast(),
    };
  }
}

/// Caso de uso `POST /coupons/validate`.
class CouponViewModel {
  ViewResult<({String code, int percent})> validate(Object? body) {
    final raw = body is Map ? body['code'] : null;
    if (raw is! String || raw.trim().isEmpty) return badRequest('Informe um código de cupom.');
    final code = normalizeCoupon(raw);
    final percent = couponPercents[code];
    if (percent == null) return notFound('Cupom inválido.');
    return Success((code: code, percent: percent));
  }
}
