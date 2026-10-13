import 'package:marketplace_backend/models/cart_item.dart';
import 'package:marketplace_backend/viewmodels/arcade_view_model.dart';
import 'package:marketplace_backend/viewmodels/auth_view_model.dart';
import 'package:marketplace_backend/viewmodels/cart_view_model.dart';
import 'package:marketplace_backend/viewmodels/order_view_model.dart';
import 'package:marketplace_backend/viewmodels/product_view_model.dart';
import 'package:marketplace_backend/viewmodels/view_result.dart';
import 'package:test/test.dart';

import 'helpers.dart';

void main() {
  group('ProductViewModel', () {
    test('lista filtra por busca e categoria e ordena por preço', () {
      final vm = ProductListViewModel(testCatalog());
      final result = vm.build(sort: 'price-asc') as Success;
      expect((result.data as List).map((p) => p.id), [3, 2, 1]);

      final roupas = vm.build(category: 'Roupas') as Success;
      expect((roupas.data as List).single.name, 'Camiseta');

      final busca = vm.build(search: 'tv') as Success;
      expect((busca.data as List).single.id, 1);
    });

    test('ordenação desconhecida é 400', () {
      expect((ProductListViewModel(testCatalog()).build(sort: 'x') as Failure).status, 400);
    });

    test('produto inexistente é 404', () {
      final vm = ProductDetailViewModel(testCatalog());
      expect((vm.build('99') as Failure).status, 404);
      expect((vm.build('abc') as Failure).status, 404);
      expect(vm.build('1'), isA<Success>());
    });
  });

  group('CartViewModel', () {
    test('valida com sucesso e soma o subtotal', () {
      final result = CartViewModel(testCatalog()).validate({
        'items': [
          {'productId': 1, 'qty': 1},
          {'productId': 2, 'qty': 2},
        ],
      });
      final data = (result as Success<CartValidation>).data;
      expect(data.subtotalCents, 100000 + 2 * 5000);
      expect(data.itemCount, 3);
    });

    test('item sem estoque ou inexistente é 409 com a lista de indisponíveis', () {
      final result = CartViewModel(testCatalog()).validate({
        'items': [
          {'productId': 1, 'qty': 5},
          {'productId': 3, 'qty': 1},
          {'productId': 42, 'qty': 1},
        ],
      });
      final failure = result as Failure;
      expect(failure.status, 409);
      final items = failure.details as List<UnavailableItem>;
      expect(items.map((i) => i.reason), ['insufficient_stock', 'insufficient_stock', 'not_found']);
      expect(items.first.available, 2);
    });

    test('itens repetidos são somados antes de conferir o estoque', () {
      final result = CartViewModel(testCatalog()).validate({
        'items': [
          {'productId': 1, 'qty': 2},
          {'productId': 1, 'qty': 1},
        ],
      });
      expect((result as Failure).status, 409);
    });

    test('corpo malformado ou carrinho vazio é 400', () {
      final vm = CartViewModel(testCatalog());
      expect((vm.validate(null) as Failure).status, 400);
      expect((vm.validate({'items': []}) as Failure).status, 400);
      expect((vm.validate({'items': [{'productId': 1}]}) as Failure).status, 400);
    });
  });

  group('AuthViewModel', () {
    test('cadastro valida campos, recusa e-mail repetido e o login confere a senha', () {
      final stores = testStores();
      final vm = AuthViewModel(stores);

      final invalid = vm.register({'name': 'Ana', 'email': 'x', 'password': '123'}) as Failure;
      expect(invalid.status, 422);
      expect((invalid.details as Map).keys, containsAll(['name', 'email', 'password']));

      final ok = vm.register({'name': 'Ana Souza', 'email': 'Ana@Teste.com', 'password': 'senhaForte1'});
      expect((ok as Success).status, 201);
      expect(stores.users.findByEmail('ana@teste.com')!.passwordHash, startsWith(r'$2a$'));

      final dup = vm.register({'name': 'Ana Souza', 'email': 'ana@teste.com', 'password': 'senhaForte1'});
      expect((dup as Failure).status, 409);

      expect((vm.login({'email': 'ana@teste.com', 'password': 'errada123'}) as Failure).status, 401);
      final session = vm.login({'email': ' ANA@teste.com', 'password': 'senhaForte1'}) as Success<AuthSession>;
      expect(stores.sessions.getUserId(session.data.token), session.data.user.id);
    });
  });

  group('OrderViewModel', () {
    late final stores = testStores();
    late int userId;

    setUp(() {
      final user = (AuthViewModel(stores)
          .register({'name': 'Bia Lima', 'email': 'bia${DateTime.now().microsecondsSinceEpoch}@t.com', 'password': 'senhaForte1'}) as Success)
          .data;
      userId = user.id as int;
    });

    test('cria o pedido, aplica cupom e pontos, baixa estoque e debita pontos', () {
      final result = OrderViewModel(stores).create(userId, {
        'items': [{'productId': 2, 'qty': 2}],
        'couponCode': 'promo10',
        'usePoints': true,
        'deliveryAddress': 'Rua A, 1',
      });
      final success = result as Success;
      final order = success.data;
      expect(success.status, 201);
      expect(order.price.subtotalCents, 10000);
      expect(order.price.couponDiscountCents, 1000);
      expect(order.price.pointsDiscountCents, 500); // 250 pts de boas-vindas = R$ 5
      expect(order.price.totalCents, 8500);
      expect(stores.catalog.findById(2)!.stock, 8);
      expect(stores.arcade.forUser(userId).points, 0);
      expect(stores.notifications.forUser(userId).first.title, contains('#${order.id}'));
    });

    test('conflito de estoque na finalização é 409 e não altera nada', () {
      final stockBefore = stores.catalog.findById(1)!.stock;
      final result = OrderViewModel(stores).create(userId, {
        'items': [{'productId': 1, 'qty': stockBefore + 1}],
        'deliveryAddress': 'Rua A, 1',
      });
      expect((result as Failure).status, 409);
      expect(stores.catalog.findById(1)!.stock, stockBefore);
      expect(stores.orders.forUser(userId), isEmpty);
    });

    test('cupom inválido e endereço vazio são 422', () {
      final vm = OrderViewModel(stores);
      final coupon = vm.create(userId, {'items': [{'productId': 2, 'qty': 1}], 'couponCode': 'NADA', 'deliveryAddress': 'X'});
      expect((coupon as Failure).code, 'invalid_coupon');
      final address = vm.create(userId, {'items': [{'productId': 2, 'qty': 1}]});
      expect((address as Failure).status, 422);
    });

    test('pedido de outro usuário responde 404', () {
      final order = (OrderViewModel(stores).create(userId, {
        'items': [{'productId': 2, 'qty': 1}],
        'deliveryAddress': 'Rua A, 1',
      }) as Success).data;
      expect((OrderViewModel(stores).get(userId + 999, '${order.id}') as Failure).status, 404);
      expect(OrderViewModel(stores).get(userId, '${order.id}'), isA<Success>());
    });
  });

  group('ArcadeViewModel', () {
    test('limite de 3 partidas por dia, liberado no dia seguinte', () {
      var now = DateTime(2026, 10, 12, 10);
      final stores = testStores(clock: () => now);
      final vm = ArcadeViewModel(stores);

      for (var i = 0; i < 3; i++) {
        expect(vm.startPlay(7), isA<Success>());
      }
      expect((vm.startPlay(7) as Failure).code, 'daily_limit');

      now = DateTime(2026, 10, 13, 9);
      expect(vm.startPlay(7), isA<Success>());
    });

    test('finalizar soma pontos, atualiza recorde e não aceita repetir', () {
      final stores = testStores();
      final vm = ArcadeViewModel(stores);
      final playId = (vm.startPlay(7) as Success).data.playId as int;

      final done = vm.finishPlay(7, '$playId', {'score': 120}) as Success<FinishedPlay>;
      expect(done.data.stats.points, 250 + 120);
      expect(done.data.stats.hiScore, 120);
      expect((vm.finishPlay(7, '$playId', {'score': 120}) as Failure).status, 404);
    });

    test('pontuação negativa ou absurda é 400', () {
      final vm = ArcadeViewModel(testStores());
      final playId = (vm.startPlay(7) as Success).data.playId as int;
      expect((vm.finishPlay(7, '$playId', {'score': -1}) as Failure).status, 400);
      expect((vm.finishPlay(7, '$playId', {'score': 999999}) as Failure).status, 400);
    });
  });
}
