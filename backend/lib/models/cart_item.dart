/// Item pedido pelo cliente: só o id do produto e a quantidade.
///
/// O preço nunca vem do cliente — é sempre lido do catálogo no servidor.
class CartItemRequest {
  final int productId;
  final int quantity;

  const CartItemRequest({required this.productId, required this.quantity});

  /// Lê `{ productId, qty }` (ou `quantity`) de um JSON. Retorna null se inválido.
  static CartItemRequest? fromJson(Object? json) {
    if (json is! Map) return null;
    final id = json['productId'];
    final qty = json['qty'] ?? json['quantity'];
    if (id is! int || qty is! int || qty <= 0) return null;
    return CartItemRequest(productId: id, quantity: qty);
  }
}

/// Produto que não pode ser atendido na quantidade pedida.
class UnavailableItem {
  final int productId;
  final String? name;
  final int requested;
  final int available;
  final String reason; // 'not_found' | 'insufficient_stock'

  const UnavailableItem({
    required this.productId,
    required this.name,
    required this.requested,
    required this.available,
    required this.reason,
  });
}
