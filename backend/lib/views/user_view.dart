import 'package:shelf/shelf.dart';

import '../models/user.dart';
import '../viewmodels/auth_view_model.dart';
import '../viewmodels/view_result.dart';
import 'json_view.dart';

/// Serialização de usuário, sessão e perfil. O hash da senha nunca sai daqui.
class UserView {
  static Map<String, Object?> userToJson(User u) => {
        'id': u.id,
        'name': u.profile.name,
        'firstName': u.profile.firstName,
        'email': u.email,
      };

  static Map<String, Object?> profileToJson(User u) => {
        'name': u.profile.name,
        'email': u.email,
        'phone': u.profile.phone,
        'cpf': u.profile.cpf,
        'cep': u.profile.cep,
        'address': u.profile.address,
      };

  static Response renderUser(ViewResult<User> result) => render(result, userToJson);

  static Response renderSession(ViewResult<AuthSession> result) =>
      render(result, (s) => {'token': s.token, 'user': userToJson(s.user)});

  static Response renderProfile(ViewResult<User> result) => render(result, profileToJson);
}
