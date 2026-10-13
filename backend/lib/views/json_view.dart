import 'dart:convert';

import 'package:shelf/shelf.dart';

import '../models/cart_item.dart';
import '../viewmodels/view_result.dart';

const _jsonHeaders = {'content-type': 'application/json; charset=utf-8'};

/// Resposta JSON genérica.
Response jsonResponse(int status, Object? body) {
  if (status == 204) return Response(204);
  return Response(status, body: jsonEncode(body), headers: _jsonHeaders);
}

/// Formato único de erro da API: `{ "error": "...", "code": "...", "details": ... }`.
Response errorResponse(int status, String code, String message, {Object? details}) =>
    jsonResponse(status, {
      'error': message,
      'code': code,
      if (details != null) 'details': details,
    });

/// Converte um [ViewResult] em resposta: sucesso usa [toJson]; falha usa o
/// formato padrão de erro.
Response render<T>(ViewResult<T> result, Object? Function(T data) toJson) {
  return switch (result) {
    Success(:final data, :final status) => jsonResponse(status, toJson(data)),
    Failure() => renderFailure(result),
  };
}

Response renderFailure(Failure<dynamic> f) =>
    errorResponse(f.status, f.code, f.message, details: detailsToJson(f.details));

/// Serializa os `details` conhecidos (erros de campo, itens indisponíveis).
Object? detailsToJson(Object? details) {
  if (details is List<UnavailableItem>) return details.map(unavailableToJson).toList();
  return details;
}

Map<String, Object?> unavailableToJson(UnavailableItem i) => {
      'productId': i.productId,
      'name': i.name,
      'requested': i.requested,
      'available': i.available,
      'reason': i.reason,
    };

/// Centavos -> reais (número com 2 casas), formato usado pelo frontend.
double money(int cents) => cents / 100;
