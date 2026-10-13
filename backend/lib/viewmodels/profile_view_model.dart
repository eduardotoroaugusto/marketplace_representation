import '../data/user_store.dart';
import '../models/user.dart';
import '../models/validators.dart';
import 'view_result.dart';

/// Leitura e edição do perfil do usuário autenticado.
class ProfileViewModel {
  final UserStore users;
  ProfileViewModel(this.users);

  ViewResult<User> get(int userId) {
    final user = users.findById(userId);
    return user == null ? notFound('Usuário não encontrado.') : Success(user);
  }

  /// Atualiza nome, telefone, CPF, CEP e logradouro. O e-mail é da conta e
  /// não muda por aqui (vem do login); se for enviado, é ignorado.
  ViewResult<User> update(int userId, Object? body) {
    final user = users.findById(userId);
    if (user == null) return notFound('Usuário não encontrado.');
    if (body is! Map) return badRequest('Envie { name, phone, cpf, cep, address }.');

    String field(String key) => body[key] is String ? (body[key] as String).trim() : '';
    final profile = UserProfile(
      name: field('name'),
      phone: field('phone'),
      cpf: field('cpf'),
      cep: field('cep'),
      address: field('address'),
    );

    final checks = {
      'name': Validators.name(profile.name),
      'phone': Validators.phone(profile.phone),
      'cpf': Validators.cpf(profile.cpf),
      'cep': Validators.cep(profile.cep),
      'address': Validators.address(profile.address),
    };
    final errors = {
      for (final e in checks.entries)
        if (e.value != null) e.key: e.value!,
    };
    if (errors.isNotEmpty) return invalidFields(errors);

    user.profile = profile;
    return Success(user);
  }
}
