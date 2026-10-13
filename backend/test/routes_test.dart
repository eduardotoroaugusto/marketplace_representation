import 'package:marketplace_backend/data/catalog_store.dart';
import 'package:marketplace_backend/models/product.dart';
import 'package:test/test.dart';

import 'helpers.dart';

/// Catálogo que sempre falha, para exercitar o 500.
class BrokenCatalog extends CatalogStore {
  BrokenCatalog() : super(const []);
  @override
  List<Product> all() => throw StateError('banco fora do ar');
}

void main() {
  late TestClient client;
  setUp(() => client = TestClient.fresh());

  group('catálogo', () {
    test('GET /products lista com preço em reais', () async {
      final res = await client.get('/products?sort=price-desc');
      expect(res.status, 200);
      expect(res.headers['content-type'], contains('application/json'));
      expect(res.json.first['price'], 1000.0);
    });

    test('GET /products/:id inexistente é 404 no formato de erro padrão', () async {
      final res = await client.get('/products/999');
      expect(res.status, 404);
      expect(res.json['code'], 'not_found');
      expect(res.json['error'], isA<String>());
    });

    test('erro inesperado vira 500 sem vazar detalhes', () async {
      final broken = TestClient.fresh(catalog: BrokenCatalog());
      final res = await broken.get('/products');
      expect(res.status, 500);
      expect(res.json['code'], 'internal_error');
      expect(res.body, isNot(contains('banco fora do ar')));
    });

    test('rota desconhecida é 404', () async {
      expect((await client.get('/nada')).status, 404);
    });
  });

  group('carrinho', () {
    test('POST /cart/validate 200 e 409 no formato do contrato', () async {
      final ok = await client.post('/cart/validate', {
        'items': [{'productId': 2, 'qty': 1}],
      });
      expect(ok.status, 200);
      expect(ok.json['ok'], isTrue);

      final conflict = await client.post('/cart/validate', {
        'items': [{'productId': 3, 'qty': 1}],
      });
      expect(conflict.status, 409);
      expect(conflict.json['ok'], isFalse);
      expect(conflict.json['indisponiveis'].single['productId'], 3);
    });

    test('JSON malformado é 400', () async {
      final res = await client.send('POST', '/cart/validate',
          headers: {'content-type': 'application/json'}, rawBody: '{"items": [');
      expect(res.status, 400);
      expect(res.json['code'], 'invalid_json');
    });

    test('POST /coupons/validate', () async {
      expect((await client.post('/coupons/validate', {'code': 'wire15'})).json['percent'], 15);
      expect((await client.post('/coupons/validate', {'code': 'XYZ'})).status, 404);
    });
  });

  group('autenticação e autorização', () {
    test('rota protegida sem token é 401 e com token inválido também', () async {
      expect((await client.get('/profile')).status, 401);
      client.token = 'token-falso';
      expect((await client.get('/profile')).json['code'], 'invalid_token');
    });

    test('cadastro, login, /auth/me e logout invalidando o token', () async {
      await client.signUp();
      final me = await client.get('/auth/me');
      expect(me.json['email'], 'ana@teste.com');
      expect(me.body, isNot(contains('passwordHash')));

      expect((await client.post('/auth/logout')).status, 204);
      expect((await client.get('/auth/me')).status, 401);
    });

    test('e-mail repetido é 409 e senha errada é 401', () async {
      await client.signUp();
      final dup = await client.post('/auth/register', {'name': 'Ana Souza', 'email': 'ANA@teste.com', 'password': 'senhaForte1'});
      expect(dup.status, 409);
      final bad = await client.post('/auth/login', {'email': 'ana@teste.com', 'password': 'errada123'});
      expect(bad.status, 401);
    });

    test('um usuário não acessa pedido nem notificação de outro', () async {
      await client.signUp(email: 'a@t.com');
      final order = await client.post('/orders', {
        'items': [{'productId': 2, 'qty': 1}],
        'deliveryAddress': 'Rua A, 1',
      });
      final orderId = order.json['orderId'];
      final notifId = (await client.get('/notifications')).json['items'].first['id'];

      await client.signUp(email: 'b@t.com', name: 'Bruno Alves');
      expect((await client.get('/orders/$orderId')).status, 404);
      expect((await client.delete('/notifications/$notifId')).status, 404);
    });
  });

  group('perfil', () {
    test('PUT /profile valida e salva; e-mail não muda', () async {
      await client.signUp();
      final invalid = await client.put('/profile', {'name': 'Ana', 'phone': '1', 'cpf': '', 'cep': '', 'address': ''});
      expect(invalid.status, 422);
      expect(invalid.json['details'].keys, containsAll(['name', 'phone', 'cpf', 'cep', 'address']));

      final ok = await client.put('/profile', {
        'name': 'Ana Maria Souza', 'email': 'hacker@x.com', 'phone': '(11) 98765-4321',
        'cpf': '123.456.789-00', 'cep': '01311-200', 'address': 'Av. Paulista, 1000',
      });
      expect(ok.status, 200);
      expect(ok.json['email'], 'ana@teste.com');
      expect((await client.get('/auth/me')).json['name'], 'Ana Maria Souza');
    });
  });

  group('notificações', () {
    test('lista, marca como lida, marca todas e remove', () async {
      await client.signUp();
      final list = await client.get('/notifications');
      expect(list.json['unreadCount'], 2);
      final id = list.json['items'].first['id'];

      expect((await client.patch('/notifications/$id/read')).json['read'], isTrue);
      expect((await client.post('/notifications/read-all')).json['unreadCount'], 0);
      expect((await client.delete('/notifications/$id')).status, 204);
      expect((await client.get('/notifications')).json['items'], hasLength(2));
    });
  });

  group('arcade e pedidos', () {
    test('partida soma pontos que viram desconto no pedido', () async {
      await client.signUp();
      final play = await client.post('/arcade/plays');
      expect(play.status, 201);
      final finish = await client.post('/arcade/plays/${play.json['playId']}/finish', {'score': 300});
      expect(finish.json['stats']['points'], 550);

      final order = await client.post('/orders', {
        'items': [{'productId': 2, 'qty': 1}],
        'usePoints': true,
        'deliveryAddress': 'Rua A, 1',
      });
      expect(order.status, 201);
      expect(order.json['order']['pointsDiscount'], 10.0); // 500 pts = R$ 10
      expect((await client.get('/arcade/stats')).json['points'], 50);
      expect((await client.get('/orders')).json, hasLength(1));
    });

    test('POST /orders com estoque insuficiente é 409 com indisponíveis', () async {
      await client.signUp();
      final res = await client.post('/orders', {
        'items': [{'productId': 1, 'qty': 3}],
        'deliveryAddress': 'Rua A, 1',
      });
      expect(res.status, 409);
      expect(res.json['indisponiveis'].single['available'], 2);
    });
  });

  group('CORS e documentação', () {
    test('preflight da origem do frontend é liberado; outra origem não', () async {
      final ok = await client.send('OPTIONS', '/products', headers: {'origin': 'http://localhost:5500'});
      expect(ok.status, 204);
      expect(ok.headers['access-control-allow-origin'], 'http://localhost:5500');

      final other = await client.send('GET', '/products', headers: {'origin': 'http://evil.com'});
      expect(other.headers['access-control-allow-origin'], isNull);
    });

    test('/docs e /openapi.yaml respondem', () async {
      expect((await client.get('/docs')).body, contains('swagger-ui'));
      expect((await client.get('/openapi.yaml')).body, startsWith('openapi'));
    });
  });
}
