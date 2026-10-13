// Regras de preço do carrinho: cupons, conversão de pontos e totais.
// Tudo em centavos.

/// Cupons válidos: código -> percentual de desconto.
/// WIRE15 é o cupom anunciado nas notificações.
const Map<String, int> couponPercents = {
  'PROMO10': 10,
  'WIRE15': 15,
};

/// Normaliza o código digitado (espaços e maiúsculas).
String normalizeCoupon(String code) => code.trim().toUpperCase();

/// Faixa da tabela de conversão do Cosmo Arcade.
class PointTier {
  final int points;
  final int valueCents;
  const PointTier(this.points, this.valueCents);
}

/// Da maior para a menor faixa (tela de Jogos: 100 = R$ 2, 250 = R$ 5, 500 = R$ 10).
const List<PointTier> pointTiers = [
  PointTier(500, 1000),
  PointTier(250, 500),
  PointTier(100, 200),
];

/// Maior faixa que o saldo permite, ou null se não alcança nenhuma.
PointTier? bestPointTier(int balance) {
  for (final tier in pointTiers) {
    if (balance >= tier.points) return tier;
  }
  return null;
}

/// Resumo de valores de um carrinho.
class PriceSummary {
  final int subtotalCents;
  final int couponDiscountCents;
  final int pointsDiscountCents;
  final int totalCents;

  const PriceSummary({
    required this.subtotalCents,
    required this.couponDiscountCents,
    required this.pointsDiscountCents,
    required this.totalCents,
  });

  int get discountCents => couponDiscountCents + pointsDiscountCents;
}

/// Calcula os totais. O desconto somado nunca passa do subtotal.
PriceSummary calculatePrice({
  required int subtotalCents,
  int couponPercent = 0,
  PointTier? pointTier,
}) {
  final coupon = (subtotalCents * couponPercent / 100).round();
  final points = pointTier?.valueCents ?? 0;
  final available = subtotalCents - coupon;
  final pointsApplied = points > available ? available : points;
  return PriceSummary(
    subtotalCents: subtotalCents,
    couponDiscountCents: coupon,
    pointsDiscountCents: pointsApplied,
    totalCents: subtotalCents - coupon - pointsApplied,
  );
}
