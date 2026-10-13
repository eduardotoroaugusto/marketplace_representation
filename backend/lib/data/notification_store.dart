import '../models/notification.dart';

/// Notificações de todos os usuários.
class NotificationStore {
  final Map<int, AppNotification> _items = {};
  int _nextId = 1;

  AppNotification add(int userId, NotificationIcon icon, String title,
      {DateTime? createdAt, bool read = false}) {
    final n = AppNotification(
      id: _nextId++,
      userId: userId,
      icon: icon,
      title: title,
      createdAt: createdAt ?? DateTime.now(),
      read: read,
    );
    _items[n.id] = n;
    return n;
  }

  /// Notificações do usuário, da mais recente para a mais antiga.
  List<AppNotification> forUser(int userId) =>
      _items.values.where((n) => n.userId == userId).toList()
        ..sort((a, b) => b.createdAt.compareTo(a.createdAt));

  /// Só devolve a notificação se ela for do usuário (autorização por dono).
  AppNotification? findForUser(int userId, int id) {
    final n = _items[id];
    return (n != null && n.userId == userId) ? n : null;
  }

  void remove(int id) => _items.remove(id);

  /// Mensagens de boas-vindas de toda conta nova (as mesmas do protótipo).
  void seedWelcome(int userId, DateTime now) {
    add(userId, NotificationIcon.package,
        'Seu carrinho atual tem itens esperando! Finalize sua compra hoje para garantir frete grátis.',
        createdAt: now.subtract(const Duration(days: 3)), read: true);
    add(userId, NotificationIcon.tag,
        'Cupom imperdível: Ganhe 15% de desconto usando o código WIRE15 na sua próxima compra.',
        createdAt: now.subtract(const Duration(hours: 2)));
    add(userId, NotificationIcon.alertTriangle,
        'Bem-vindo! Por segurança, nunca compartilhe sua senha. Um novo login foi registrado na sua conta.',
        createdAt: now.subtract(const Duration(minutes: 1)));
  }
}
