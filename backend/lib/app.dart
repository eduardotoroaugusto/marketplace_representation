import 'package:shelf/shelf.dart';

import 'data/app_stores.dart';
import 'middleware/cors_middleware.dart';
import 'middleware/error_middleware.dart';
import 'router.dart';

/// Origens do frontend liberadas por padrão no CORS (servidor estático local).
const defaultAllowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
];

/// Monta o pipeline completo: log → erros → CORS → rotas.
///
/// O `bin/server.dart` sobe exatamente este handler; os testes de integração
/// chamam o mesmo handler direto, sem abrir porta HTTP.
Handler buildApp(
  AppStores stores, {
  List<String> allowedOrigins = defaultAllowedOrigins,
  String? openApiSpec,
  bool logRequests = false,
}) {
  var pipeline = const Pipeline();
  if (logRequests) pipeline = pipeline.addMiddleware(_logRequests());
  return pipeline
      .addMiddleware(handleErrors())
      .addMiddleware(corsHeaders(allowedOrigins: allowedOrigins))
      .addHandler(buildRouter(stores, openApiSpec: openApiSpec));
}

Middleware _logRequests() => logRequests();
