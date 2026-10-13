import '../data/app_stores.dart';
import '../models/arcade_stats.dart';
import 'view_result.dart';

/// Partida encerrada: pontos ganhos e estado atualizado.
class FinishedPlay {
  final int earned;
  final ArcadeStats stats;
  const FinishedPlay(this.earned, this.stats);
}

/// Cosmo Arcade: saldo, limite diário e registro das partidas.
///
/// Fluxo: `POST /arcade/plays` inicia a partida (já conta no limite do dia,
/// como no frontend — recarregar a página não devolve a tentativa) e
/// `POST /arcade/plays/{id}/finish` registra a pontuação.
class ArcadeViewModel {
  final AppStores stores;
  ArcadeViewModel(this.stores);

  ArcadeStats _stats(int userId) =>
      stores.arcade.forUser(userId)..rollDay(ArcadeStats.dayKey(stores.clock()));

  ViewResult<ArcadeStats> stats(int userId) => Success(_stats(userId));

  ViewResult<({int playId, ArcadeStats stats})> startPlay(int userId) {
    final stats = _stats(userId);
    if (stats.playsLeft == 0) {
      return Failure(409, 'daily_limit',
          'Você já usou as ${ArcadeStats.maxPlaysPerDay} partidas de hoje. Volte amanhã!');
    }
    // Uma partida aberta e não finalizada é abandonada (ela já contou no limite)
    stats.playsToday += 1;
    stats.openPlayId = stores.arcade.nextPlayId();
    return Success((playId: stats.openPlayId!, stats: stats), status: 201);
  }

  ViewResult<FinishedPlay> finishPlay(int userId, String playId, Object? body) {
    final stats = _stats(userId);
    final id = int.tryParse(playId);
    if (id == null || id != stats.openPlayId) {
      return notFound('Partida não encontrada ou já finalizada.');
    }

    final score = body is Map ? body['score'] : null;
    if (score is! int || score < 0 || score > ArcadeStats.maxScorePerGame) {
      return badRequest('"score" deve ser um inteiro entre 0 e ${ArcadeStats.maxScorePerGame}.');
    }

    stats.openPlayId = null;
    stats.points += score;
    if (score > stats.hiScore) stats.hiScore = score;
    return Success(FinishedPlay(score, stats));
  }
}
