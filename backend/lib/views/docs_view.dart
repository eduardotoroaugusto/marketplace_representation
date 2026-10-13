import 'package:shelf/shelf.dart';

import 'json_view.dart';

/// Documentação da API: especificação OpenAPI + página do Swagger UI.
class DocsView {
  /// `GET /openapi.yaml` — o arquivo `docs/openapi.yaml`.
  static Response spec(String? yaml) {
    if (yaml == null) {
      return errorResponse(404, 'not_found', 'Especificação OpenAPI não carregada.');
    }
    return Response.ok(yaml, headers: {'content-type': 'application/yaml; charset=utf-8'});
  }

  /// `GET /docs` — Swagger UI (carregado da CDN) apontando para `/openapi.yaml`.
  static Response swaggerUi() => Response.ok(_html, headers: {'content-type': 'text/html; charset=utf-8'});

  static const _html = '''<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Marketplace API — Swagger</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
  <style>body { margin: 0; } .topbar { display: none; }</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.ui = SwaggerUIBundle({
      url: '/openapi.yaml',
      dom_id: '#swagger-ui',
      deepLinking: true,
      persistAuthorization: true,
      tryItOutEnabled: true
    });
  </script>
</body>
</html>''';
}
