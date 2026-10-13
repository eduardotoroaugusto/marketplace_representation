import 'dart:io';

import 'package:marketplace_backend/app.dart';
import 'package:marketplace_backend/config.dart';
import 'package:marketplace_backend/data/app_stores.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;

/// Sobe a API. Rode a partir da pasta `backend/`:
///
///     dart run bin/server.dart
Future<void> main() async {
  final config = Config.load();
  final stores = AppStores.seeded(bcryptLogRounds: config.bcryptLogRounds);

  final specFile = File('docs/openapi.yaml');
  final spec = specFile.existsSync() ? specFile.readAsStringSync() : null;
  if (spec == null) stderr.writeln('Aviso: docs/openapi.yaml não encontrado; /docs ficará sem conteúdo.');

  final handler = buildApp(
    stores,
    allowedOrigins: config.allowedOrigins,
    openApiSpec: spec,
    logRequests: true,
  );

  final HttpServer server;
  try {
    server = await shelf_io.serve(handler, InternetAddress.anyIPv4, config.port);
  } on SocketException {
    stderr.writeln('A porta ${config.port} já está em uso por outro programa.\n'
        'Feche esse programa ou escolha outra porta no arquivo backend/.env (ex.: PORT=8082)\n'
        'e ajuste API_BASE_URL em frontend/js/services/config.js.');
    exit(1);
  }
  print('API rodando em http://localhost:${server.port}');
  print('Swagger UI:     http://localhost:${server.port}/docs');
  print('CORS liberado para: ${config.allowedOrigins.join(', ')}');
}
