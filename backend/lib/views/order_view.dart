import 'package:shelf/shelf.dart';

import '../models/cart_item.dart';
import '../models/order.dart';
import '../viewmodels/view_result.dart';
import 'json_view.dart';

/// Serialização de pedidos.
class OrderView {
  static Map<String, Object?> toJson(Order o) => {
        'id': o.id,
        'status': o.status.name,
        'createdAt': o.createdAt.toUtc().toIso8601String(),
        'items': [
          for (final l in o.lines)
            {
              'productId': l.productId,
              'name': l.name,
              'unitPrice': money(l.unitPriceCents),
              'qty': l.quantity,
              'subtotal': money(l.subtotalCents),
            },
        ],
        'itemCount': o.itemCount,
        'couponCode': o.couponCode,
        'pointsUsed': o.pointsUsed,
        'subtotal': money(o.price.subtotalCents),
        'couponDiscount': money(o.price.couponDiscountCents),
        'pointsDiscount': money(o.price.pointsDiscountCents),
        'discount': money(o.price.discountCents),
        'total': money(o.price.totalCents),
        'paymentMethod': o.paymentMethod,
        'deliveryAddress': o.deliveryAddress,
      };

  /// `201 { orderId, order }`; estoque insuficiente vira `409` com `indisponiveis`.
  static Response renderCreated(ViewResult<Order> result) {
    return switch (result) {
      Success(:final data, :final status) => jsonResponse(status, {'orderId': data.id, 'order': toJson(data)}),
      Failure(status: 409, code: 'stock_unavailable', :final details, :final message) =>
        jsonResponse(409, {
          'error': message,
          'code': 'stock_unavailable',
          'indisponiveis': (details as List<UnavailableItem>).map(unavailableToJson).toList(),
        }),
      Failure() => renderFailure(result),
    };
  }

  static Response renderOne(ViewResult<Order> result) => render(result, toJson);

  static Response renderList(ViewResult<List<Order>> result) =>
      render(result, (list) => list.map(toJson).toList());
}
