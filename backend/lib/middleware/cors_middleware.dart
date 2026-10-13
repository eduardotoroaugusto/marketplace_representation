import 'package:shelf/shelf.dart';

/// Cabeçalhos CORS escritos à mão.
///
/// Libera só as origens do frontend ([allowedOrigins]). Como a autenticação
/// usa token Bearer (e não cookie), não é preciso `Allow-Credentials`.
/// Requisições `OPTIONS` (preflight do navegador) são respondidas aqui mesmo.
Middleware corsHeaders({required List<String> allowedOrigins}) {
  Map<String, String> headersFor(String? origin) => {
        if (origin != null && allowedOrigins.contains(origin)) 'access-control-allow-origin': origin,
        'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'access-control-allow-headers': 'content-type, authorization',
        'access-control-max-age': '600',
        'vary': 'Origin',
      };

  return (Handler inner) {
    return (Request request) async {
      final cors = headersFor(request.headers['origin']);
      if (request.method == 'OPTIONS') return Response(204, headers: cors);
      final response = await inner(request);
      return response.change(headers: cors);
    };
  };
}
