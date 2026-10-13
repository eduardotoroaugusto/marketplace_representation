import 'package:shelf/shelf.dart';

import '../models/notification.dart';
import '../viewmodels/notification_view_model.dart';
import '../viewmodels/view_result.dart';
import 'json_view.dart';

/// Serialização de notificações.
class NotificationView {
  /// Nomes de ícone usados pelos arquivos do frontend (assets/icons/*.svg).
  static const _iconNames = {
    NotificationIcon.package: 'package',
    NotificationIcon.alertTriangle: 'alert-triangle',
    NotificationIcon.tag: 'tag',
  };

  static Map<String, Object?> toJson(AppNotification n) => {
        'id': n.id,
        'icon': _iconNames[n.icon],
        'title': n.title,
        'createdAt': n.createdAt.toUtc().toIso8601String(),
        'read': n.read,
      };

  static Map<String, Object?> listToJson(NotificationList l) => {
        'items': l.items.map(toJson).toList(),
        'unreadCount': l.unreadCount,
      };

  static Response renderList(ViewResult<NotificationList> result) => render(result, listToJson);

  static Response renderOne(ViewResult<AppNotification> result) => render(result, toJson);
}
