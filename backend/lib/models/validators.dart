/// Regras de validação de formulários.
///
/// Repetem as validações do frontend: a validação do cliente é só
/// conveniência de UX — a API pode ser chamada direto (curl, Postman),
/// então o servidor valida tudo de novo.
class Validators {
  static final _name = RegExp(r'^[A-Za-zÀ-ÖØ-öø-ÿ]+(\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)+$');
  static final _email = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');
  static final _phone = RegExp(r'^\(\d{2}\)\s?\d{4,5}-\d{4}$');
  static final _cpf = RegExp(r'^\d{3}\.\d{3}\.\d{3}-\d{2}$');
  static final _cep = RegExp(r'^\d{5}-?\d{3}$');

  static const minPasswordLength = 8;

  static String? name(String? value) {
    final v = (value ?? '').trim();
    if (v.isEmpty) return 'Informe o nome completo.';
    if (!_name.hasMatch(v)) return 'Nome e sobrenome, apenas letras.';
    return null;
  }

  static String? email(String? value) {
    if (!_email.hasMatch((value ?? '').trim())) {
      return 'E-mail incompleto ou formato inválido.';
    }
    return null;
  }

  static String? password(String? value) {
    if ((value ?? '').length < minPasswordLength) {
      return 'A senha deve ter no mínimo $minPasswordLength caracteres.';
    }
    return null;
  }

  static String? phone(String? value) =>
      _phone.hasMatch((value ?? '').trim()) ? null : 'Telefone no formato (11) 98765-4321.';

  static String? cpf(String? value) =>
      _cpf.hasMatch((value ?? '').trim()) ? null : 'CPF no formato 123.456.789-00.';

  static String? cep(String? value) =>
      _cep.hasMatch((value ?? '').trim()) ? null : 'CEP no formato 01311-200.';

  static String? address(String? value) =>
      (value ?? '').trim().isEmpty ? 'Informe o logradouro.' : null;

  /// E-mails são comparados sem diferenciar maiúsculas e sem espaços nas pontas.
  static String normalizeEmail(String value) => value.trim().toLowerCase();
}
