import 'dart:io';

import 'package:shelf/shelf.dart';

import '../views/json_view.dart';
import 'json_body.dart';

/// Captura qualquer erro não tratado e responde `500` em JSON, sem expor a
/// pilha de chamadas ao cliente (ela vai só para o log do servidor).
Middleware handleErrors() {
  return (Handler inner) {
    return (Request request) async {
      try {
        return await inner(request);
      } on HijackException {
        rethrow;
      } on InvalidJson {
        return errorResponse(400, 'invalid_json', 'O corpo da requisição não é um JSON válido.');
      } catch (error, stack) {
        stderr.writeln('Erro em ${request.method} /${request.url}: $error\n$stack');
        return errorResponse(500, 'internal_error', 'Erro interno do servidor.');
      }
    };
  };
}
