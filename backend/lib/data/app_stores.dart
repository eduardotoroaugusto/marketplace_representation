import 'arcade_store.dart';
import 'catalog_store.dart';
import 'notification_store.dart';
import 'order_store.dart';
import 'session_store.dart';
import 'user_store.dart';

/// Agrupa todos os armazenamentos da aplicação.
///
/// O servidor cria uma instância única ([AppStores.seeded]); cada teste cria a
/// sua, então um teste nunca enxerga dados de outro.
class AppStores {
  final CatalogStore catalog;
  final UserStore users;
  final SessionStore sessions;
  final OrderStore orders;
  final NotificationStore notifications;
  final ArcadeStore arcade;

  /// Custo do bcrypt (log2 das rodadas). 10 em produção; os testes usam o
  /// mínimo (4) para rodar rápido.
  final int bcryptLogRounds;

  /// Relógio injetável, para testar a virada do dia no limite de partidas.
  final DateTime Function() clock;

  AppStores({
    required this.catalog,
    UserStore? users,
    SessionStore? sessions,
    OrderStore? orders,
    NotificationStore? notifications,
    ArcadeStore? arcade,
    this.bcryptLogRounds = 10,
    DateTime Function()? clock,
  })  : users = users ?? UserStore(),
        sessions = sessions ?? SessionStore(),
        orders = orders ?? OrderStore(),
        notifications = notifications ?? NotificationStore(),
        arcade = arcade ?? ArcadeStore(),
        clock = clock ?? DateTime.now;

  factory AppStores.seeded({int bcryptLogRounds = 10}) =>
      AppStores(catalog: CatalogStore.seeded(), bcryptLogRounds: bcryptLogRounds);
}
