// js/models/arcadeStats.js

// Regras do Cosmo Arcade (tabela de conversão e limite diário da tela de Jogos)
const MAX_PLAYS_PER_DAY = 3;
const POINT_TIERS = [            // da maior para a menor faixa
  { points: 500, value: 10 },
  { points: 250, value: 5 },
  { points: 100, value: 2 }
];

// Maior faixa de desconto que o saldo permite (ou null se não alcança nenhuma)
function bestPointTier(balance) {
  return POINT_TIERS.find(tier => balance >= tier.points) || null;
}

class ArcadeStats {
  constructor({ points, hiScore, playsDate, playsToday }) {
    this.points = points;         // saldo acumulado de pontos
    this.hiScore = hiScore;       // recorde do usuário
    this.playsDate = playsDate;   // dia (AAAA-MM-DD) a que playsToday se refere
    this.playsToday = playsToday; // partidas iniciadas hoje
  }

  get playsLeft() {
    return Math.max(0, MAX_PLAYS_PER_DAY - this.playsToday);
  }
}
