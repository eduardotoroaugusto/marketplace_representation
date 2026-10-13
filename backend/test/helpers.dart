import 'dart:convert';

import 'package:marketplace_backend/app.dart';
import 'package:marketplace_backend/data/app_stores.dart';
import 'package:marketplace_backend/data/catalog_store.dart';
import 'package:marketplace_backend/models/product.dart';
import 'package:shelf/shelf.dart';

/// Catálogo pequeno e previsível para os testes.
CatalogStore testCatalog() => CatalogStore([
      Product(id: 1, name: 'TV', priceCents: 100000, stock: 2, category: 'Eletrônicos', rating: 4),
      Product(id: 2, name: 'Camiseta', priceCents: 5000, stock: 10, category: 'Roupas', rating: 4),
      Product(id: 3, name: 'Livro', priceCents: 2000, stock: 0, category: 'Livros', rating: 4),
    ]);

/// Stores novos a cada teste (bcrypt no custo mínimo para ser rápido).
AppStores testStores({CatalogStore? catalog, DateTime Function()? clock}) =>
    AppStores(catalog: catalog ?? testCatalog(), bcryptLogRounds: 4, clock: clock);

/// Cliente que chama o handler direto, sem abrir porta HTTP.
class TestClient {
  final Handler handler;
  String? token;
  TestClient(this.handler);

  factory TestClient.fresh({CatalogStore? catalog}) =>
      TestClient(buildApp(testStores(catalog: catalog), openApiSpec: 'openapi: 3.0.3'));

  Future<TestResponse> send(String method, String path,
      {Object? body, String? rawBody, Map<String, String>? headers}) async {
    final response = await handler(Request(
      method,
      Uri.parse('http://localhost$path'),
      body: rawBody ?? (body == null ? null : jsonEncode(body)),
      headers: {
        if (body != null) 'content-type': 'application/json',
        if (token != null) 'authorization': 'Bearer $token',
        ...?headers,
      },
    ));
    final text = await response.readAsString();
    return TestResponse(response.statusCode, response.headers, text);
  }

  Future<TestResponse> get(String path) => send('GET', path);
  Future<TestResponse> post(String path, [Object? body]) => send('POST', path, body: body);
  Future<TestResponse> put(String path, [Object? body]) => send('PUT', path, body: body);
  Future<TestResponse> patch(String path) => send('PATCH', path);
  Future<TestResponse> delete(String path) => send('DELETE', path);

  /// Cadastra, faz login e guarda o token para as próximas chamadas.
  Future<void> signUp({String email = 'ana@teste.com', String name = 'Ana Souza'}) async {
    await post('/auth/register', {'name': name, 'email': email, 'password': 'senhaForte1'});
    final login = await post('/auth/login', {'email': email, 'password': 'senhaForte1'});
    token = login.json['token'] as String;
  }
}

class TestResponse {
  final int status;
  final Map<String, String> headers;
  final String body;
  TestResponse(this.status, this.headers, this.body);

  dynamic get json => body.isEmpty ? null : jsonDecode(body);
}
