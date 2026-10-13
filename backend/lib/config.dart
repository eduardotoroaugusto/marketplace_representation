import 'dart:io';

import 'app.dart';

/// Porta padrão da API.
const defaultPort = 8082;

/// Configuração do servidor, lida das variáveis de ambiente e do arquivo
/// `backend/.env` (formato `CHAVE=valor`, uma por linha). Variáveis de
/// ambiente reais têm prioridade sobre o `.env`.
///
/// - `PORT`: porta HTTP (padrão 8081 — a 8080 costuma estar ocupada pelo
///   Apache do XAMPP)
/// - `ALLOWED_ORIGINS`: origens do frontend separadas por vírgula
///   (padrão `http://localhost:5500,http://127.0.0.1:5500`)
/// - `BCRYPT_ROUNDS`: custo do bcrypt, 4 a 31 (padrão 10)
class Config {
  final int port;
  final List<String> allowedOrigins;
  final int bcryptLogRounds;

  const Config(
      {required this.port,
      required this.allowedOrigins,
      required this.bcryptLogRounds});

  factory Config.load({String envFile = '.env'}) {
    final values = {..._readEnvFile(envFile), ...Platform.environment};

    final origins = (values['ALLOWED_ORIGINS'] ?? '')
        .split(',')
        .map((o) => o.trim())
        .where((o) => o.isNotEmpty)
        .toList();

    return Config(
      port: int.tryParse(values['PORT'] ?? '') ?? defaultPort,
      allowedOrigins: origins.isEmpty ? defaultAllowedOrigins : origins,
      bcryptLogRounds:
          (int.tryParse(values['BCRYPT_ROUNDS'] ?? '') ?? 10).clamp(4, 31),
    );
  }

  static Map<String, String> _readEnvFile(String path) {
    final file = File(path);
    if (!file.existsSync()) return {};
    final result = <String, String>{};
    for (final line in file.readAsLinesSync()) {
      final trimmed = line.trim();
      if (trimmed.isEmpty || trimmed.startsWith('#') || !trimmed.contains('='))
        continue;
      final i = trimmed.indexOf('=');
      result[trimmed.substring(0, i).trim()] = trimmed.substring(i + 1).trim();
    }
    return result;
  }
}
