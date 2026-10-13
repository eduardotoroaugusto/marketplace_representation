import '../models/arcade_stats.dart';

/// Estado do Cosmo Arcade de cada usuário.
class ArcadeStore {
  final Map<int, ArcadeStats> _stats = {};
  int _nextPlayId = 1;

  /// Cria o estado na primeira consulta (com o saldo de boas-vindas).
  ArcadeStats forUser(int userId) => _stats.putIfAbsent(userId, ArcadeStats.new);

  int nextPlayId() => _nextPlayId++;
}
