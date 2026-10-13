import 'package:bcrypt/bcrypt.dart';

import '../data/app_stores.dart';
import '../models/user.dart';
import '../models/validators.dart';
import 'view_result.dart';

/// Sessão criada no login.
class AuthSession {
  final String token;
  final User user;
  const AuthSession(this.token, this.user);
}

/// Cadastro, login e logout.
class AuthViewModel {
  final AppStores stores;
  AuthViewModel(this.stores);

  ViewResult<User> register(Object? body) {
    if (body is! Map) return badRequest('Envie { name, email, password }.');
    final name = body['name'];
    final email = body['email'];
    final password = body['password'];
    final confirm = body['confirmPassword'];

    final errors = <String, String>{};
    final nameErr = Validators.name(name is String ? name : null);
    final emailErr = Validators.email(email is String ? email : null);
    final passErr = Validators.password(password is String ? password : null);
    if (nameErr != null) errors['name'] = nameErr;
    if (emailErr != null) errors['email'] = emailErr;
    if (passErr != null) errors['password'] = passErr;
    // A confirmação é opcional na API, mas se vier tem que bater
    if (confirm != null && confirm != password) errors['confirmPassword'] = 'As senhas não coincidem.';
    if (errors.isNotEmpty) return invalidFields(errors);

    if (stores.users.emailTaken(email as String)) {
      return const Failure(409, 'email_taken', 'Este e-mail já está em uso.');
    }

    final hash = BCrypt.hashpw(password as String, BCrypt.gensalt(logRounds: stores.bcryptLogRounds));
    final user = stores.users.create(email: email, passwordHash: hash, name: name as String);

    // Toda conta nova começa com as notificações de boas-vindas e o saldo do arcade
    stores.notifications.seedWelcome(user.id, stores.clock());
    stores.arcade.forUser(user.id);

    return Success(user, status: 201);
  }

  ViewResult<AuthSession> login(Object? body) {
    final email = body is Map ? body['email'] : null;
    final password = body is Map ? body['password'] : null;
    if (email is! String || password is! String || email.isEmpty || password.isEmpty) {
      return badRequest('Informe e-mail e senha.');
    }

    final user = stores.users.findByEmail(email);
    // Mesma mensagem para e-mail inexistente e senha errada: não revela quais e-mails existem
    if (user == null || !BCrypt.checkpw(password, user.passwordHash)) {
      return const Failure(401, 'invalid_credentials', 'Credenciais inválidas ou usuário não encontrado!');
    }
    return Success(AuthSession(stores.sessions.create(user.id), user));
  }

  ViewResult<void> logout(String token) {
    stores.sessions.revoke(token);
    return const Success(null, status: 204);
  }

  ViewResult<User> me(int userId) {
    final user = stores.users.findById(userId);
    if (user == null) return const Failure(401, 'unauthorized', 'Sessão inválida.');
    return Success(user);
  }
}
