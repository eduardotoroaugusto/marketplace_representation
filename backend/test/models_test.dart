import 'package:marketplace_backend/models/arcade_stats.dart';
import 'package:marketplace_backend/models/cart_item.dart';
import 'package:marketplace_backend/models/pricing.dart';
import 'package:marketplace_backend/models/product.dart';
import 'package:marketplace_backend/models/validators.dart';
import 'package:test/test.dart';

void main() {
  group('Product', () {
    Product tv() => Product(id: 1, name: 'TV', priceCents: 100, stock: 3, category: 'X', rating: 4);

    test('hasStock aceita até o estoque e recusa zero ou mais que o estoque', () {
      final p = tv();
      expect(p.hasStock(3), isTrue);
      expect(p.hasStock(4), isFalse);
      expect(p.hasStock(0), isFalse);
    });

    test('decreaseStock baixa o estoque e falha se não houver', () {
      final p = tv()..decreaseStock(2);
      expect(p.stock, 1);
      expect(() => p.decreaseStock(2), throwsStateError);
    });
  });

  group('CartItemRequest.fromJson', () {
    test('aceita qty ou quantity', () {
      expect(CartItemRequest.fromJson({'productId': 1, 'qty': 2})!.quantity, 2);
      expect(CartItemRequest.fromJson({'productId': 1, 'quantity': 3})!.quantity, 3);
    });

    test('recusa quantidade zero, negativa ou tipos errados', () {
      expect(CartItemRequest.fromJson({'productId': 1, 'qty': 0}), isNull);
      expect(CartItemRequest.fromJson({'productId': '1', 'qty': 1}), isNull);
      expect(CartItemRequest.fromJson('x'), isNull);
    });
  });

  group('pricing', () {
    test('cupom de 10% sobre R\$ 269,70', () {
      final p = calculatePrice(subtotalCents: 26970, couponPercent: 10);
      expect(p.couponDiscountCents, 2697);
      expect(p.totalCents, 24273);
    });

    test('pontos usam a maior faixa possível', () {
      expect(bestPointTier(99), isNull);
      expect(bestPointTier(250)!.valueCents, 500);
      expect(bestPointTier(620)!.points, 500);
    });

    test('desconto somado nunca passa do subtotal', () {
      final p = calculatePrice(subtotalCents: 500, couponPercent: 15, pointTier: bestPointTier(500));
      expect(p.totalCents, 0);
      expect(p.discountCents, 500);
    });
  });

  group('Validators', () {
    test('nome exige nome e sobrenome', () {
      expect(Validators.name('Ana Souza'), isNull);
      expect(Validators.name('Ana'), isNotNull);
    });

    test('e-mail, senha, telefone, CPF e CEP', () {
      expect(Validators.email('a@b.com'), isNull);
      expect(Validators.email('a@b'), isNotNull);
      expect(Validators.password('1234567'), isNotNull);
      expect(Validators.phone('(11) 98765-4321'), isNull);
      expect(Validators.cpf('123.456.789-00'), isNull);
      expect(Validators.cep('01311200'), isNull);
    });

    test('normalizeEmail ignora maiúsculas e espaços', () {
      expect(Validators.normalizeEmail('  Ana@Teste.COM '), 'ana@teste.com');
    });
  });

  group('ArcadeStats', () {
    test('a contagem de partidas zera quando o dia muda', () {
      final s = ArcadeStats(playsDate: '2026-10-11', playsToday: 3);
      expect(s.playsLeft, 0);
      s.rollDay('2026-10-12');
      expect(s.playsLeft, ArcadeStats.maxPlaysPerDay);
    });
  });
}
