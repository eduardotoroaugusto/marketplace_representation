import '../data/catalog_store.dart';
import '../models/product.dart';
import 'view_result.dart';

/// Lista do catálogo com busca, filtro por categoria e ordenação
/// (os mesmos controles da Home).
class ProductListViewModel {
  final CatalogStore catalog;
  ProductListViewModel(this.catalog);

  static const sorts = ['relevance', 'price-asc', 'price-desc'];

  ViewResult<List<Product>> build({String? search, String? category, String? sort}) {
    final sortBy = sort ?? 'relevance';
    if (!sorts.contains(sortBy)) {
      return badRequest('Ordenação inválida. Use: ${sorts.join(', ')}.');
    }

    final term = (search ?? '').trim().toLowerCase();
    final cat = (category ?? '').trim();

    final list = catalog.all().where((p) {
      final matchTerm = term.isEmpty || p.name.toLowerCase().contains(term);
      final matchCategory = cat.isEmpty || cat == 'Todos' || p.category == cat;
      return matchTerm && matchCategory;
    }).toList();

    if (sortBy == 'price-asc') list.sort((a, b) => a.priceCents.compareTo(b.priceCents));
    if (sortBy == 'price-desc') list.sort((a, b) => b.priceCents.compareTo(a.priceCents));

    return Success(list);
  }
}

/// Detalhe de um produto.
class ProductDetailViewModel {
  final CatalogStore catalog;
  ProductDetailViewModel(this.catalog);

  ViewResult<Product> build(String id) {
    final productId = int.tryParse(id);
    final product = productId == null ? null : catalog.findById(productId);
    if (product == null) return notFound('Produto não encontrado.');
    return Success(product);
  }
}
