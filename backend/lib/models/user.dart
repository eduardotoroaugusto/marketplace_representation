/// Conta de usuário. Guarda apenas o hash bcrypt da senha, nunca o texto puro.
class User {
  final int id;
  final String email;
  final String passwordHash;
  final DateTime createdAt;
  UserProfile profile;

  User({
    required this.id,
    required this.email,
    required this.passwordHash,
    required this.profile,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();
}

/// Dados pessoais editáveis na tela de Perfil (o e-mail fica na [User]).
class UserProfile {
  final String name;
  final String phone;
  final String cpf;
  final String cep;
  final String address;

  const UserProfile({
    required this.name,
    this.phone = '',
    this.cpf = '',
    this.cep = '',
    this.address = '',
  });

  /// Primeiro nome, usado na saudação do cabeçalho.
  String get firstName => name.trim().split(RegExp(r'\s+')).first;
}
