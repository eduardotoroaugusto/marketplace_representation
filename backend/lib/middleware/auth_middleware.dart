import 'package:shelf/shelf.dart';

import '../data/session_store.dart';
import '../views/json_view.dart';

/// Chaves que o [requireAuth] coloca no contexto da requisição.
const userIdKey = 'userId';
const tokenKey = 'token';

/// Exige `Authorization: Bearer <token>` válido.
///
/// O usuário é identificado sempre pelo token — nunca por um id enviado no
/// corpo ou na query. O `userId` autenticado vai para o contexto da
/// requisição antes do handler rodar.
Middleware requireAuth(SessionStore sessions) {
  return (Handler inner) {
    return (Request req) async {
      final header = req.headers['authorization'];
      if (header == null || !header.startsWith('Bearer ')) {
        return errorResponse(401, 'unauthorized', 'Não autenticado. Envie o cabeçalho Authorization: Bearer <token>.');
      }
      final token = header.substring(7).trim();
      final userId = sessions.getUserId(token);
      if (userId == null) {
        return errorResponse(401, 'invalid_token', 'Token inválido ou sessão encerrada.');
      }
      return inner(req.change(context: {userIdKey: userId, tokenKey: token}));
    };
  };
}

/// Id do usuário autenticado (só existe em rotas protegidas por [requireAuth]).
extension AuthContext on Request {
  int get userId => context[userIdKey] as int;
  String get token => context[tokenKey] as String;
}
