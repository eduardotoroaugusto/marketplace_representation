/// Produto do catálogo.
///
/// O preço é guardado em centavos ([priceCents]) para que somas e descontos
/// sejam feitos com inteiros, sem os erros de arredondamento de `double`.
class Product {
  final int id;
  final String name;
  final int priceCents;
  final String category;
  final double rating;
  int stock;

  Product({
    required this.id,
    required this.name,
    required this.priceCents,
    required this.stock,
    required this.category,
    required this.rating,
  });

  /// Há pelo menos uma unidade disponível.
  bool get inStock => stock > 0;

  /// O estoque atual atende a [quantity] unidades.
  bool hasStock(int quantity) => quantity > 0 && stock >= quantity;

  /// Baixa [quantity] unidades do estoque (chamar só depois de [hasStock]).
  void decreaseStock(int quantity) {
    if (!hasStock(quantity)) {
      throw StateError('Estoque insuficiente para "$name".');
    }
    stock -= quantity;
  }
}
