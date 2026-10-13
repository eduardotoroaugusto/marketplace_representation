import 'pricing.dart';

/// Linha de um pedido: copia nome e preço do produto no momento da compra,
/// para o histórico não mudar se o catálogo mudar depois.
class OrderLine {
  final int productId;
  final String name;
  final int unitPriceCents;
  final int quantity;

  const OrderLine({
    required this.productId,
    required this.name,
    required this.unitPriceCents,
    required this.quantity,
  });

  int get subtotalCents => unitPriceCents * quantity;
}

/// Situação do pedido. Sem gateway de pagamento real, todo pedido criado
/// já nasce confirmado.
enum OrderStatus { confirmed, shipped, delivered, cancelled }

/// Pedido finalizado por um usuário.
class Order {
  final int id;
  final int userId;
  final List<OrderLine> lines;
  final String? couponCode;
  final int pointsUsed;
  final PriceSummary price;
  final String paymentMethod;
  final String deliveryAddress;
  final DateTime createdAt;
  OrderStatus status;

  Order({
    required this.id,
    required this.userId,
    required this.lines,
    required this.couponCode,
    required this.pointsUsed,
    required this.price,
    required this.paymentMethod,
    required this.deliveryAddress,
    this.status = OrderStatus.confirmed,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  int get itemCount => lines.fold(0, (sum, line) => sum + line.quantity);
}

/// Formas de pagamento aceitas (só identificação: não há cobrança real).
const List<String> paymentMethods = ['credit_card', 'pix', 'boleto'];
