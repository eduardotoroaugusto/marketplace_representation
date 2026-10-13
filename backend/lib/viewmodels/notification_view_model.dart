import '../data/notification_store.dart';
import '../models/notification.dart';
import 'view_result.dart';

/// Lista de notificações + total de não lidas.
class NotificationList {
  final List<AppNotification> items;
  const NotificationList(this.items);
  int get unreadCount => items.where((n) => !n.read).length;
}

/// Central de Notificações do usuário autenticado.
class NotificationViewModel {
  final NotificationStore store;
  NotificationViewModel(this.store);

  ViewResult<NotificationList> list(int userId) => Success(NotificationList(store.forUser(userId)));

  ViewResult<AppNotification> markRead(int userId, String id) {
    final n = _find(userId, id);
    if (n == null) return notFound('Notificação não encontrada.');
    n.read = true;
    return Success(n);
  }

  ViewResult<NotificationList> markAllRead(int userId) {
    final items = store.forUser(userId);
    for (final n in items) {
      n.read = true;
    }
    return Success(NotificationList(items));
  }

  ViewResult<void> remove(int userId, String id) {
    final n = _find(userId, id);
    if (n == null) return notFound('Notificação não encontrada.');
    store.remove(n.id);
    return const Success(null, status: 204);
  }

  // Notificação de outro usuário responde 404, igual a uma inexistente
  AppNotification? _find(int userId, String id) {
    final parsed = int.tryParse(id);
    return parsed == null ? null : store.findForUser(userId, parsed);
  }
}
