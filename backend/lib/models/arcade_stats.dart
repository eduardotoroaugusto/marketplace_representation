/// Regras do Cosmo Arcade: saldo de pontos, recorde e limite diário.
class ArcadeStats {
  static const maxPlaysPerDay = 3;

  /// Maior pontuação aceita por partida (20 pontos por alien, ondas
  /// infinitas — o teto só barra valores claramente forjados).
  static const maxScorePerGame = 20000;

  /// Saldo dado a toda conta nova, para o desconto poder ser testado.
  static const welcomePoints = 250;

  int points;
  int hiScore;
  String playsDate; // AAAA-MM-DD do dia a que playsToday se refere
  int playsToday;
  int? openPlayId; // partida iniciada e ainda não finalizada

  ArcadeStats({
    this.points = welcomePoints,
    this.hiScore = 0,
    this.playsDate = '',
    this.playsToday = 0,
    this.openPlayId,
  });

  /// Zera a contagem quando o dia muda.
  void rollDay(String today) {
    if (playsDate != today) {
      playsDate = today;
      playsToday = 0;
    }
  }

  int get playsLeft {
    final left = maxPlaysPerDay - playsToday;
    return left < 0 ? 0 : left;
  }

  /// Data local no formato AAAA-MM-DD.
  static String dayKey(DateTime now) =>
      '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
}
