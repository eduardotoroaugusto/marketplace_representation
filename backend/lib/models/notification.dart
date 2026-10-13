/// Tipos de ícone usados pela Central de Notificações do frontend.
enum NotificationIcon { package, alertTriangle, tag }

/// Notificação de um usuário.
class AppNotification {
  final int id;
  final int userId;
  final NotificationIcon icon;
  final String title;
  final DateTime createdAt;
  bool read;

  AppNotification({
    required this.id,
    required this.userId,
    required this.icon,
    required this.title,
    required this.createdAt,
    this.read = false,
  });
}
