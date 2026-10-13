import '../models/order.dart';
import '../models/pricing.dart';

/// Pedidos finalizados.
class OrderStore {
  final Map<int, Order> _orders = {};
  int _nextId = 1001;

  Order create({
    required int userId,
    required List<OrderLine> lines,
    required String? couponCode,
    required int pointsUsed,
    required PriceSummary price,
    required String paymentMethod,
    required String deliveryAddress,
  }) {
    final order = Order(
      id: _nextId++,
      userId: userId,
      lines: lines,
      couponCode: couponCode,
      pointsUsed: pointsUsed,
      price: price,
      paymentMethod: paymentMethod,
      deliveryAddress: deliveryAddress,
    );
    _orders[order.id] = order;
    return order;
  }

  Order? findById(int id) => _orders[id];

  /// Pedidos do usuário, do mais recente para o mais antigo.
  List<Order> forUser(int userId) =>
      _orders.values.where((o) => o.userId == userId).toList()
        ..sort((a, b) => b.id.compareTo(a.id));
}
