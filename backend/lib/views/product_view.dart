import 'package:shelf/shelf.dart';

import '../models/product.dart';
import '../viewmodels/view_result.dart';
import 'json_view.dart';

/// Serialização de produtos.
class ProductView {
  static Map<String, Object?> toJson(Product p) => {
        'id': p.id,
        'name': p.name,
        'price': money(p.priceCents),
        'stock': p.stock,
        'inStock': p.inStock,
        'category': p.category,
        'rating': p.rating,
      };

  static Response renderList(ViewResult<List<Product>> result) =>
      render(result, (list) => list.map(toJson).toList());

  static Response renderOne(ViewResult<Product> result) => render(result, toJson);
}
