import 'dart:io';

import 'package:test/test.dart';
import 'package:yaml/yaml.dart';

/// Garante que a documentação Swagger acompanha o código: toda rota
/// registrada em `lib/router.dart` precisa estar em `docs/openapi.yaml`
/// (e vice-versa), com o mesmo método HTTP.
void main() {
  test('docs/openapi.yaml documenta exatamente as rotas do router', () {
    final spec = loadYaml(File('docs/openapi.yaml').readAsStringSync()) as YamlMap;
    expect(spec['openapi'], startsWith('3.'));

    final documented = <String>{
      for (final entry in (spec['paths'] as YamlMap).entries)
        for (final method in (entry.value as YamlMap).keys) '${method.toString().toUpperCase()} ${entry.key}',
    };

    final source = File('lib/router.dart').readAsStringSync();
    final registered = <String>{
      for (final m in RegExp(r"\.\.(get|post|put|patch|delete)\('(/[^']*)'").allMatches(source))
        '${m[1]!.toUpperCase()} ${m[2]!.replaceAllMapped(RegExp(r'<(\w+)>'), (p) => '{${p[1]}}')}',
    }..removeAll({'GET /docs', 'GET /openapi.yaml'}); // a própria documentação

    expect(documented, equals(registered));
  });
}
