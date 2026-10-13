import '../data/app_stores.dart';
import '../models/cart_item.dart';
import '../models/notification.dart';
import '../models/order.dart';
import '../models/pricing.dart';
import 'cart_view_model.dart';
import 'view_result.dart';

/// Finalização de compra e consulta de pedidos.
class OrderViewModel {
  final AppStores stores;
  OrderViewModel(this.stores);

  /// `POST /orders` — corpo:
  /// `{ items: [{productId, qty}], couponCode?, usePoints?, paymentMethod?, deliveryAddress }`
  ///
  /// Preços vêm sempre do catálogo (nunca do cliente). O estoque é conferido
  /// de novo aqui, porque pode ter acabado entre a validação do carrinho e a
  /// finalização. Como o Dart processa uma requisição por vez no event loop e
  /// este método não tem `await`, conferir e baixar o estoque acontece sem
  /// que outra compra se intercale.
  ViewResult<Order> create(int userId, Object? body) {
    final user = stores.users.findById(userId);
    if (user == null) return const Failure(401, 'unauthorized', 'Sessão inválida.');

    final List<CartItemRequest> requested;
    switch (CartViewModel.parseItems(body)) {
      case Success(:final data):
        requested = data;
      case final Failure<List<CartItemRequest>> failure:
        return failure.cast();
    }
    final map = body as Map;

    // Cupom (opcional)
    String? couponCode;
    var couponPercent = 0;
    final rawCoupon = map['couponCode'];
    if (rawCoupon != null && rawCoupon is! String) return badRequest('"couponCode" deve ser texto.');
    if (rawCoupon is String && rawCoupon.trim().isNotEmpty) {
      couponCode = normalizeCoupon(rawCoupon);
      final percent = couponPercents[couponCode];
      if (percent == null) return const Failure(422, 'invalid_coupon', 'Cupom inválido.');
      couponPercent = percent;
    }

    // Forma de pagamento (identificação apenas — sem cobrança real)
    final payment = map['paymentMethod'] ?? 'credit_card';
    if (payment is! String || !paymentMethods.contains(payment)) {
      return badRequest('"paymentMethod" deve ser um de: ${paymentMethods.join(', ')}.');
    }

    // Endereço: o enviado, ou o do perfil
    final rawAddress = map['deliveryAddress'];
    final address = (rawAddress is String && rawAddress.trim().isNotEmpty)
        ? rawAddress.trim()
        : user.profile.address.trim();
    if (address.isEmpty) {
      return invalidFields({'deliveryAddress': 'Informe o endereço de entrega.'});
    }

    // Pontos do Cosmo Arcade (opcional): usa a maior faixa que o saldo permite
    final arcade = stores.arcade.forUser(userId);
    PointTier? tier;
    if (map['usePoints'] == true) {
      tier = bestPointTier(arcade.points);
      if (tier == null) {
        return Failure(422, 'insufficient_points',
            'Você precisa de pelo menos ${pointTiers.last.points} pontos.');
      }
    }

    // Estoque no momento da finalização
    final CartValidation cart;
    switch (CartViewModel(stores.catalog).check(requested)) {
      case Success(:final data):
        cart = data;
      case final Failure<CartValidation> failure:
        return failure.cast();
    }

    final price = calculatePrice(
      subtotalCents: cart.subtotalCents,
      couponPercent: couponPercent,
      pointTier: tier,
    );

    // A partir daqui nada mais falha: baixa estoque, debita pontos e grava o pedido
    for (final item in cart.items) {
      item.product.decreaseStock(item.quantity);
    }
    if (tier != null) arcade.points -= tier.points;

    final order = stores.orders.create(
      userId: userId,
      lines: [
        for (final item in cart.items)
          OrderLine(
            productId: item.product.id,
            name: item.product.name,
            unitPriceCents: item.product.priceCents,
            quantity: item.quantity,
          ),
      ],
      couponCode: couponCode,
      pointsUsed: tier?.points ?? 0,
      price: price,
      paymentMethod: payment,
      deliveryAddress: address,
    );

    stores.notifications.add(userId, NotificationIcon.package,
        'Pedido #${order.id} confirmado! Seu pagamento foi aprovado e o envio está sendo preparado.');

    return Success(order, status: 201);
  }

  ViewResult<List<Order>> list(int userId) => Success(stores.orders.forUser(userId));

  /// Pedido de outro usuário responde 404, igual a um inexistente: não
  /// revela que o id existe.
  ViewResult<Order> get(int userId, String id) {
    final orderId = int.tryParse(id);
    final order = orderId == null ? null : stores.orders.findById(orderId);
    if (order == null || order.userId != userId) return notFound('Pedido não encontrado.');
    return Success(order);
  }
}
