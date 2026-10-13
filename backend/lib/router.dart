import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';

import 'data/app_stores.dart';
import 'middleware/auth_middleware.dart';
import 'middleware/json_body.dart';
import 'viewmodels/arcade_view_model.dart';
import 'viewmodels/auth_view_model.dart';
import 'viewmodels/cart_view_model.dart';
import 'viewmodels/notification_view_model.dart';
import 'viewmodels/order_view_model.dart';
import 'viewmodels/product_view_model.dart';
import 'viewmodels/profile_view_model.dart';
import 'views/arcade_view.dart';
import 'views/cart_view.dart';
import 'views/docs_view.dart';
import 'views/json_view.dart';
import 'views/notification_view.dart';
import 'views/order_view.dart';
import 'views/product_view.dart';
import 'views/user_view.dart';

/// Todas as rotas da API, registradas manualmente.
///
/// Cada rota segue o mesmo fluxo: lê a requisição → chama o ViewModel do caso
/// de uso → a View transforma o resultado em resposta HTTP. Rotas com
/// [auth] exigem o token Bearer; o id do usuário vem de `req.userId`.
///
/// [openApiSpec] é o conteúdo de `docs/openapi.yaml`, servido em
/// `/openapi.yaml` e usado pelo Swagger UI em `/docs`.
Handler buildRouter(AppStores stores, {String? openApiSpec}) {
  final auth = requireAuth(stores.sessions);

  final router = Router(notFoundHandler: (Request req) {
    return errorResponse(404, 'route_not_found', 'Rota não encontrada: ${req.method} /${req.url.path}');
  });

  // ---------- Infra / documentação ----------
  router
    ..get('/health', (Request req) => jsonResponse(200, {'status': 'ok'}))
    ..get('/docs', (Request req) => DocsView.swaggerUi())
    ..get('/openapi.yaml', (Request req) => DocsView.spec(openApiSpec));

  // ---------- Autenticação ----------
  router
    ..post('/auth/register', (Request req) async {
      final result = AuthViewModel(stores).register(await readJson(req));
      return UserView.renderUser(result);
    })
    ..post('/auth/login', (Request req) async {
      final result = AuthViewModel(stores).login(await readJson(req));
      return UserView.renderSession(result);
    })
    ..post('/auth/logout', auth((Request req) {
      return render(AuthViewModel(stores).logout(req.token), (_) => null);
    }))
    ..get('/auth/me', auth((Request req) {
      return UserView.renderUser(AuthViewModel(stores).me(req.userId));
    }));

  // ---------- Catálogo ----------
  router
    ..get('/products', (Request req) {
      final q = req.url.queryParameters;
      final result = ProductListViewModel(stores.catalog)
          .build(search: q['search'], category: q['category'], sort: q['sort']);
      return ProductView.renderList(result);
    })
    ..get('/products/<id>', (Request req) {
      final result = ProductDetailViewModel(stores.catalog).build(req.params['id']!);
      return ProductView.renderOne(result);
    });

  // ---------- Carrinho e cupons ----------
  router
    ..post('/cart/validate', (Request req) async {
      final result = CartViewModel(stores.catalog).validate(await readJson(req));
      return CartView.renderValidation(result);
    })
    ..post('/coupons/validate', (Request req) async {
      return CartView.renderCoupon(CouponViewModel().validate(await readJson(req)));
    });

  // ---------- Perfil ----------
  router
    ..get('/profile', auth((Request req) {
      return UserView.renderProfile(ProfileViewModel(stores.users).get(req.userId));
    }))
    ..put('/profile', auth((Request req) async {
      final result = ProfileViewModel(stores.users).update(req.userId, await readJson(req));
      return UserView.renderProfile(result);
    }));

  // ---------- Notificações ----------
  router
    ..get('/notifications', auth((Request req) {
      return NotificationView.renderList(NotificationViewModel(stores.notifications).list(req.userId));
    }))
    ..post('/notifications/read-all', auth((Request req) {
      return NotificationView.renderList(NotificationViewModel(stores.notifications).markAllRead(req.userId));
    }))
    ..patch('/notifications/<id>/read', auth((Request req) {
      final result = NotificationViewModel(stores.notifications).markRead(req.userId, req.params['id']!);
      return NotificationView.renderOne(result);
    }))
    ..delete('/notifications/<id>', auth((Request req) {
      final result = NotificationViewModel(stores.notifications).remove(req.userId, req.params['id']!);
      return render(result, (_) => null);
    }));

  // ---------- Cosmo Arcade ----------
  router
    ..get('/arcade/stats', auth((Request req) {
      return ArcadeView.renderStats(ArcadeViewModel(stores).stats(req.userId));
    }))
    ..post('/arcade/plays', auth((Request req) {
      return ArcadeView.renderStarted(ArcadeViewModel(stores).startPlay(req.userId));
    }))
    ..post('/arcade/plays/<id>/finish', auth((Request req) async {
      final result = ArcadeViewModel(stores).finishPlay(req.userId, req.params['id']!, await readJson(req));
      return ArcadeView.renderFinished(result);
    }));

  // ---------- Pedidos ----------
  router
    ..post('/orders', auth((Request req) async {
      final result = OrderViewModel(stores).create(req.userId, await readJson(req));
      return OrderView.renderCreated(result);
    }))
    ..get('/orders', auth((Request req) {
      return OrderView.renderList(OrderViewModel(stores).list(req.userId));
    }))
    ..get('/orders/<id>', auth((Request req) {
      return OrderView.renderOne(OrderViewModel(stores).get(req.userId, req.params['id']!));
    }));

  return router.call;
}
