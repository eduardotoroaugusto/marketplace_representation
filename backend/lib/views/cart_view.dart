import 'package:shelf/shelf.dart';

import '../models/cart_item.dart';
import '../viewmodels/cart_view_model.dart';
import '../viewmodels/view_result.dart';
import 'json_view.dart';

/// Respostas de `POST /cart/validate` e `POST /coupons/validate`.
class CartView {
  /// Sucesso: `200 { ok: true, items, itemCount, subtotal }`.
  /// Sem estoque: `409 { ok: false, indisponiveis: [...] }` (formato do contrato).
  static Response renderValidation(ViewResult<CartValidation> result) {
    return switch (result) {
      Success(:final data) => jsonResponse(200, {
          'ok': true,
          'items': [
            for (final i in data.items)
              {
                'productId': i.product.id,
                'name': i.product.name,
                'unitPrice': money(i.product.priceCents),
                'qty': i.quantity,
                'subtotal': money(i.subtotalCents),
              },
          ],
          'itemCount': data.itemCount,
          'subtotal': money(data.subtotalCents),
        }),
      Failure(status: 409, :final details, :final message, :final code) => jsonResponse(409, {
          'ok': false,
          'error': message,
          'code': code,
          'indisponiveis': (details as List<UnavailableItem>).map(unavailableToJson).toList(),
        }),
      Failure() => renderFailure(result),
    };
  }

  static Response renderCoupon(ViewResult<({String code, int percent})> result) =>
      render(result, (c) => {'code': c.code, 'percent': c.percent});
}
