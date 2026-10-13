import 'dart:convert';

import 'package:shelf/shelf.dart';

/// Corpo inválido (JSON malformado).
class InvalidJson implements Exception {
  const InvalidJson();
}

/// Lê o corpo da requisição como JSON. Corpo vazio vira `null`.
/// Lança [InvalidJson] se o texto não for JSON válido.
Future<Object?> readJson(Request request) async {
  final text = await request.readAsString();
  if (text.trim().isEmpty) return null;
  try {
    return jsonDecode(text);
  } on FormatException {
    throw const InvalidJson();
  }
}
