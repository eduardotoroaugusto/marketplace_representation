import 'dart:convert';
import 'dart:math';

/// Sessões: mapa token opaco -> id do usuário.
///
/// O token é só um identificador aleatório (32 bytes de `Random.secure`),
/// sem dados dentro — diferente de um JWT. Sair da conta apaga o token.
class SessionStore {
  final Map<String, int> _sessions = {};
  final Random _random = Random.secure();

  /// Cria uma sessão para [userId] e devolve o token.
  String create(int userId) {
    final bytes = List<int>.generate(32, (_) => _random.nextInt(256));
    final token = base64Url.encode(bytes).replaceAll('=', '');
    _sessions[token] = userId;
    return token;
  }

  int? getUserId(String token) => _sessions[token];

  void revoke(String token) => _sessions.remove(token);
}
