import '../models/product.dart';

/// Catálogo de produtos em memória.
///
/// Não há banco de dados: os dados vivem enquanto o servidor estiver de pé e
/// voltam ao estado inicial a cada reinício. Os testes criam um
/// `CatalogStore` próprio para não depender desse estado.
class CatalogStore {
  final Map<int, Product> _products;

  CatalogStore(Iterable<Product> products)
      : _products = {for (final p in products) p.id: p};

  /// Catálogo inicial — o mesmo exibido na Home do frontend.
  factory CatalogStore.seeded() => CatalogStore([
        Product(id: 1, name: 'Smart TV 4K 55"', priceCents: 249900, stock: 8, category: 'Eletrônicos', rating: 4.0),
        Product(id: 2, name: 'Smartphone 128GB Pro', priceCents: 419900, stock: 5, category: 'Eletrônicos', rating: 4.0),
        Product(id: 3, name: 'Camiseta Algodão Básica', priceCents: 5990, stock: 20, category: 'Roupas', rating: 4.0),
        Product(id: 4, name: 'Tênis Corrida Performance', priceCents: 34990, stock: 12, category: 'Esportes', rating: 4.0),
        Product(id: 5, name: 'Caneca Cerâmica Térmica', priceCents: 8900, stock: 15, category: 'Casa', rating: 4.0),
        Product(id: 6, name: 'Livro: Design de Interfaces UX', priceCents: 12000, stock: 7, category: 'Livros', rating: 4.0),
      ]);

  /// Todos os produtos, na ordem de cadastro ("mais relevantes").
  List<Product> all() => _products.values.toList();

  Product? findById(int id) => _products[id];
}
