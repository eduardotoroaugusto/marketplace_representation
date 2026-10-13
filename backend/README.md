# Backend — API em Dart (Shelf)

API REST do **Carrinho de Compras Interativo**, em **Dart + Shelf** com arquitetura **MVVM**, seguindo o `plano_de_projeto.md`.

📘 **Documentação interativa (Swagger):** com o servidor rodando, abra **http://localhost:8081/docs**.
A especificação OpenAPI fica em [`docs/openapi.yaml`](docs/openapi.yaml) (servida em `/openapi.yaml`).

---

## Como rodar

Requisitos: **Dart SDK 3.5+** (vem junto com o Flutter).

```bash
cd backend
dart pub get                 # baixa as dependências (só na primeira vez)
dart run bin/server.dart     # sobe em http://localhost:8081
dart test                    # roda os testes
```

### Configuração (`backend/.env`)

Copie `.env.example` para `.env` (o `.env` não vai para o git). Variáveis de ambiente reais têm prioridade sobre o arquivo.

| Variável | Padrão | Para quê |
|---|---|---|
| `PORT` | `8081` | Porta HTTP. A 8080 costuma estar ocupada pelo Apache do XAMPP |
| `ALLOWED_ORIGINS` | `http://localhost:5500,http://127.0.0.1:5500` | Origens do frontend liberadas no CORS |
| `BCRYPT_ROUNDS` | `10` | Custo do bcrypt (4 a 31) |

Se mudar a porta, ajuste também `API_BASE_URL` em `frontend/js/services/config.js`.

---

## Arquitetura (MVVM)

```
backend/
├── bin/server.dart            Lê a configuração, carrega o openapi.yaml e sobe o servidor
├── docs/openapi.yaml          Especificação OpenAPI 3 (Swagger)
├── lib/
│   ├── app.dart               Pipeline: log → erros → CORS → rotas
│   ├── config.dart            PORT, ALLOWED_ORIGINS, BCRYPT_ROUNDS
│   ├── router.dart            TODAS as rotas, registradas manualmente
│   ├── models/                Entidades e regras de negócio (sem HTTP)
│   │   ├── product.dart           Produto, estoque (hasStock / decreaseStock)
│   │   ├── cart_item.dart         Item pedido pelo cliente, item indisponível
│   │   ├── order.dart             Pedido, linhas, status, formas de pagamento
│   │   ├── pricing.dart           Cupons, tabela de pontos, cálculo de totais (centavos)
│   │   ├── user.dart              Conta e perfil
│   │   ├── notification.dart      Notificação
│   │   ├── arcade_stats.dart      Saldo, recorde, limite diário do Cosmo Arcade
│   │   └── validators.dart        Validações de formulário (iguais às do frontend)
│   ├── data/                  Armazenamento em memória
│   │   ├── app_stores.dart        Agrupa todos os stores (um por servidor / por teste)
│   │   ├── catalog_store.dart     Catálogo inicial (o mesmo da Home)
│   │   ├── user_store.dart, session_store.dart, order_store.dart,
│   │   └── notification_store.dart, arcade_store.dart
│   ├── viewmodels/            Casos de uso: decidem o resultado (ViewResult)
│   │   ├── view_result.dart       Success(data, status) | Failure(status, code, message, details)
│   │   ├── auth_view_model.dart, product_view_model.dart, cart_view_model.dart,
│   │   └── order_view_model.dart, profile_view_model.dart, notification_view_model.dart, arcade_view_model.dart
│   ├── views/                 Só serializam o resultado em resposta HTTP (status + JSON)
│   │   ├── json_view.dart         Formato padrão de erro, render(), money()
│   │   ├── product_view.dart, cart_view.dart, order_view.dart, user_view.dart,
│   │   └── notification_view.dart, arcade_view.dart, docs_view.dart (Swagger UI)
│   └── middleware/
│       ├── cors_middleware.dart   Cabeçalhos CORS escritos à mão + preflight OPTIONS
│       ├── auth_middleware.dart   requireAuth(): token Bearer → userId no contexto
│       ├── error_middleware.dart  Erro inesperado → 500 JSON; JSON malformado → 400
│       └── json_body.dart         Leitura do corpo JSON
└── test/                      Testes (package:test)
```

**Fluxo de uma rota** (`lib/router.dart`):

```dart
..get('/products/<id>', (Request req) {
  final result = ProductDetailViewModel(stores.catalog).build(req.params['id']!);  // ViewModel decide
  return ProductView.renderOne(result);                                              // View serializa
})
```

- **Model:** entidades e regras (`Product.hasStock`, `calculatePrice`, `bestPointTier`, validações).
- **ViewModel:** orquestra o caso de uso e devolve um `ViewResult` — `Success` ou `Failure` com status HTTP e código de erro. Não conhece HTTP, então é testado sem servidor.
- **View:** transforma o `ViewResult` em `Response` (status + JSON).

---

## Rotas

🔒 = exige `Authorization: Bearer <token>`.

| Método | Rota | Descrição | Sucesso | Erros |
|---|---|---|---|---|
| GET | `/health` | Servidor no ar | 200 | — |
| POST | `/auth/register` | Cria conta | 201 | 400, 409, 422 |
| POST | `/auth/login` | Login → token | 200 | 400, 401 |
| POST | `/auth/logout` 🔒 | Invalida o token | 204 | 401 |
| GET | `/auth/me` 🔒 | Usuário do token | 200 | 401 |
| GET | `/products` | Lista (`?search=&category=&sort=`) | 200 | 400, 500 |
| GET | `/products/{id}` | Detalhe | 200 | 404 |
| POST | `/cart/validate` | Confere estoque | 200 `{ok:true}` | 400, 409 `{ok:false, indisponiveis}` |
| POST | `/coupons/validate` | Confere cupom | 200 | 400, 404 |
| POST | `/orders` 🔒 | Finaliza a compra | 201 `{orderId, order}` | 400, 401, 409, 422 |
| GET | `/orders` 🔒 | Histórico | 200 | 401 |
| GET | `/orders/{id}` 🔒 | Detalhe/status | 200 | 401, 404 |
| GET | `/profile` 🔒 | Perfil | 200 | 401 |
| PUT | `/profile` 🔒 | Atualiza perfil | 200 | 400, 401, 422 |
| GET | `/notifications` 🔒 | Lista + não lidas | 200 | 401 |
| POST | `/notifications/read-all` 🔒 | Marca todas | 200 | 401 |
| PATCH | `/notifications/{id}/read` 🔒 | Marca uma | 200 | 401, 404 |
| DELETE | `/notifications/{id}` 🔒 | Remove | 204 | 401, 404 |
| GET | `/arcade/stats` 🔒 | Pontos, recorde, partidas | 200 | 401 |
| POST | `/arcade/plays` 🔒 | Inicia partida (conta no limite) | 201 | 401, 409 |
| POST | `/arcade/plays/{id}/finish` 🔒 | Registra pontuação | 200 | 400, 401, 404 |
| GET | `/docs` | Swagger UI | 200 | — |
| GET | `/openapi.yaml` | Especificação OpenAPI | 200 | — |

As 5 rotas do contrato original (`/products`, `/products/{id}`, `/cart/validate`, `/orders`, `/orders/{id}`) seguem exatamente o formato do plano; as demais (autenticação, perfil, notificações, cupons, arcade) foram definidas a partir das telas.

**Formato de erro** (sempre o mesmo):

```json
{ "error": "Mensagem para exibir", "code": "codigo_estavel", "details": { "campo": "mensagem" } }
```

---

## Regras de negócio

- **Preços só no servidor:** o cliente manda `productId` e `qty`; o preço vem do catálogo. Cálculos em **centavos inteiros**; a API devolve reais (`2499.9`).
- **Estoque conferido duas vezes:** em `/cart/validate` e de novo em `POST /orders` (pode ter acabado no meio). Como o Dart processa uma requisição por vez no *event loop* e a criação do pedido não tem `await` entre conferir e baixar o estoque, duas compras não se intercalam.
- **Pedido atômico:** se qualquer validação falhar (cupom, pontos, endereço, estoque), nada é alterado.
- **Cupons:** `PROMO10` (10%) e `WIRE15` (15%).
- **Pontos do Cosmo Arcade:** maior faixa que o saldo permite — 500 pts = R$ 10, 250 = R$ 5, 100 = R$ 2. Conta nova ganha 250 pts. O desconto total nunca passa do subtotal.
- **Limite do jogo:** 3 partidas por dia, contadas ao **iniciar**; zera à meia-noite (horário do servidor). Pontuação aceita: 0 a 20000.
- **Pedido gera notificação** “Pedido #N confirmado!”.

## Segurança

- **Senhas com bcrypt** (custo 10). Nunca texto puro.
- **Token opaco** (32 bytes de `Random.secure`) guardado no `SessionStore`; logout apaga o token.
- **Autorização por dono:** `requireAuth` coloca o `userId` do token no contexto; nenhuma rota confia num id vindo do corpo. Recurso de outro usuário responde **404**.
- **Validação no servidor** independente do frontend.
- **Login não revela** se o e-mail existe (mesma resposta para e-mail inexistente e senha errada).
- **CORS** liberado só para as origens do frontend.
- **Erros 500** não expõem a pilha de chamadas (vai só para o log).

## Testes

```bash
dart test
```

| Arquivo | Cobre |
|---|---|
| `test/models_test.dart` | `Product.hasStock`/`decreaseStock`, cálculo de preço, faixas de pontos, validadores, virada do dia no arcade |
| `test/view_models_test.dart` | Catálogo (404), carrinho (409, itens somados, 400), cadastro/login, pedido (sucesso, 409 sem alterar nada, 422, dono), arcade (limite diário, pontuação) |
| `test/routes_test.dart` | Integração chamando o handler do Shelf direto: 404, 409, **500**, 401, CORS, logout, perfil, notificações, pedidos com pontos |
| `test/openapi_test.dart` | Garante que o `docs/openapi.yaml` documenta **exatamente** as rotas do `router.dart` |

Os testes usam stores em memória novos a cada caso e bcrypt no custo mínimo, então rodam em menos de 2 segundos.

## Limitações

- **Persistência em memória:** reiniciar o servidor apaga contas, pedidos e sessões.
- **Sem pagamento real:** o pedido nasce `confirmed`; `paymentMethod` é só identificação.
- **Pontuação do jogo informada pelo cliente** (com teto). Num sistema real, a partida seria validada no servidor.
