import '../models/user.dart';
import '../models/validators.dart';

/// Usuários cadastrados, indexados por id e por e-mail normalizado.
class UserStore {
  final Map<int, User> _byId = {};
  final Map<String, User> _byEmail = {};
  int _nextId = 1;

  User? findById(int id) => _byId[id];

  User? findByEmail(String email) => _byEmail[Validators.normalizeEmail(email)];

  bool emailTaken(String email) => findByEmail(email) != null;

  /// Cria a conta. O e-mail já deve ter sido validado e checado com [emailTaken].
  User create({required String email, required String passwordHash, required String name}) {
    final user = User(
      id: _nextId++,
      email: Validators.normalizeEmail(email),
      passwordHash: passwordHash,
      profile: UserProfile(name: name.trim()),
    );
    _byId[user.id] = user;
    _byEmail[user.email] = user;
    return user;
  }
}
