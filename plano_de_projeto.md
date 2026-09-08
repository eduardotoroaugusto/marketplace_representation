# Plano de Projeto — Carrinho de Compras Interativo (Opção D)

**Disciplina:** Programação em Ambiente Visual
**Base:** edital "Projeto: Aplicação Web Orientada a Eventos"
**Grupo:** 3 integrantes — Líder técnico (integração e revisão geral), Frontend, Backend (Dart)

---

## 1. Arquitetura

### 1.1 Frontend — HTML5 + CSS3 + JavaScript vanilla (MVVM)

```
/frontend
  index.html
  /css
    styles.css
  /js
    models/
      product.js
      cartItem.js
    viewmodels/
      cartViewModel.js
      catalogViewModel.js
    views/
      catalogView.js
      cartView.js
      notificationView.js
    services/
      api.js
    events/
      domEvents.js
    main.js
```

Mecanismo de binding (Observable):

```js
class Observable {
  #listeners = [];
  #value;
  constructor(initial) { this.#value = initial; }
  get value() { return this.#value; }
  set value(v) { this.#value = v; this.#listeners.forEach(fn => fn(v)); }
  subscribe(fn) { this.#listeners.push(fn); fn(this.#value); return () => { this.#listeners = this.#listeners.filter(l => l !== fn); }; }
}
```

Fluxo: `domEvents.js` captura o evento DOM → chama um comando no ViewModel (`cartViewModel.addItem(product)`) → o ViewModel aplica a regra do Model e atualiza seu `Observable` → `cartView.js`, inscrito nesse Observable, re-renderiza.

### 1.2 Backend — Dart (Shelf), MVVM

```
/backend
  bin/
    server.dart            # monta o Pipeline (middlewares) + Router e sobe o servidor
  lib/
    router.dart             # todas as rotas registradas manualmente
    models/
      product.dart
      order.dart
    viewmodels/
      product_view_model.dart
      cart_view_model.dart
      order_view_model.dart
    views/
      product_view.dart
      cart_view.dart
      order_view.dart
    data/
      catalog_store.dart
    middleware/
      cors_middleware.dart   # cabeçalhos CORS escritos à mão
```

Pacotes: `shelf`, `shelf_router` (só o casamento de rota com parâmetro, ex. `/products/<id>` — o roteamento em si continua manual, não é um framework com convenções escondidas), `shelf_io` (sobe o servidor HTTP).

Exemplo de rota (`lib/router.dart`):

```dart
final router = Router()
  ..get('/products', (Request req) async {
    final viewModel = ProductListViewModel(CatalogStore.instance);
    final result = await viewModel.build();
    return ProductView.render(result);
  })
  ..get('/products/<id>', (Request req, String id) async {
    final viewModel = ProductDetailViewModel(CatalogStore.instance);
    final result = await viewModel.build(id);
    return ProductView.render(result);
  });
```

Entrada do servidor (`bin/server.dart`):

```dart
void main() async {
  final handler = const Pipeline()
      .addMiddleware(logRequests())
      .addMiddleware(corsHeaders())
      .addHandler(router);
  await shelf_io.serve(handler, InternetAddress.anyIPv4, 8080);
}
```

Divisão de responsabilidade: o Model contém as entidades e regras de negócio; o ViewModel orquestra o caso de uso e decide o resultado; a View apenas serializa esse resultado em uma resposta HTTP (status code + JSON).

---

## 2. Contrato da API

| Método | Rota | Corpo | Sucesso | Erro |
|---|---|---|---|---|
| GET | `/products` | — | 200 + lista de produtos (id, nome, preço, estoque) | 500 |
| GET | `/products/:id` | — | 200 + produto | 404 |
| POST | `/cart/validate` | `{ items: [{productId, qty}] }` | 200 `{ ok: true }` | 409 `{ ok: false, indisponiveis: [...] }` |
| POST | `/orders` | carrinho validado + dados do formulário | 201 `{ orderId }` | 409 (estoque insuficiente no momento da finalização) |
| GET | `/orders/:id` | — | 200 + status do pedido | 404 |

Endpoints de autenticação, perfil e notificações serão definidos depois que as telas correspondentes estiverem fechadas.

---

## 3. Segurança (Autenticação e Autorização)

Princípios que valem desde já, independente de quando os endpoints de auth forem fechados:

- **Autenticação:** token opaco (Bearer), gerado no login/cadastro e guardado num mapa token → usuário no backend. Preferido a JWT nesse projeto: resolve o mesmo problema sem exigir gerência de expiração/assinatura, mais simples de implementar e de explicar na apresentação.
- **Senhas:** hash com `bcrypt` (pacote do pub.dev). Nunca texto puro, e nunca um hash rápido genérico (ex. SHA-256 puro do pacote `crypto`) — hash de senha precisa ser deliberadamente lento.
- **Autorização por dono do recurso:** toda rota protegida identifica o usuário a partir do token, nunca a partir de um campo enviado pelo cliente no corpo ou na query da requisição. Um middleware decodifica o token e injeta o `userId` autenticado no contexto da requisição antes do handler rodar:

```dart
Middleware requireAuth() {
  return (Handler inner) {
    return (Request req) async {
      final header = req.headers['authorization'];
      if (header == null || !header.startsWith('Bearer ')) {
        return Response(401, body: jsonEncode({'error': 'não autenticado'}));
      }
      final userId = SessionStore.instance.getUserId(header.substring(7));
      if (userId == null) return Response(401, body: jsonEncode({'error': 'token inválido'}));
      return inner(req.change(context: {'userId': userId}));
    };
  };
}
```

- **Validação server-side independente da client-side:** a validação de formulário no frontend (seção 4, item 3) é conveniência de UX, não segurança — a API pode ser chamada diretamente (Postman, curl) sem passar pelo frontend, então o backend valida tudo de novo.
- **CORS:** liberado apenas para a origem do frontend. Como a autenticação usa Bearer token em vez de cookie, não há necessidade de `credentials: include` nem de restringir `Access-Control-Allow-Origin` por causa de cookie de sessão.

---

## 4. Requisitos técnicos obrigatórios

| # | Requisito | Onde |
|---|---|---|
| 1 | Mouse (click, mouseover/mouseout) | `domEvents.js`: `click` → `cartViewModel.addItem()` (via delegação); `mouseover`/`mouseout` destaca o card do produto |
| 2 | Teclado | `domEvents.js`: `input` no campo de busca → `catalogViewModel.filter()`; `keydown` (Enter) aplica cupom |
| 3 | Formulário | `submit` do checkout com `blur`/`change` validando campos antes de chamar `cartViewModel.checkout()` |
| 4 | Delegação de eventos | Listener no container do catálogo (`catalogView.js`), capturando cliques de botões criados após o `fetch` inicial |
| 5 | Eventos assíncronos | `api.js` chamado pelos ViewModels: `GET /products`, `POST /cart/validate`, `POST /orders`, com `try/catch` tratando sucesso e erros 404/409/500 |
| 6 | Temporizadores | `setTimeout` em `notificationView.js` (toast); `setInterval` opcional para cupom |
| 7 | Remoção de listeners | `removeEventListener` ao fechar toast ou remover item do carrinho, antes de remover o nó do DOM |
| 8 | 3+ arquivos separados | HTML + CSS + JS modularizado em Model/View/ViewModel/services/events |

---

## 5. Testes

### Frontend

- **Model e ViewModel (lógica pura, sem DOM):** testes unitários com `node:assert`, sem framework — roda com `node test/nomeDoTeste.js`. Cobre, por exemplo, `cartViewModel.addItem()`/`removeItem()`, cálculo de total, e o `Observable` notificando os subscribers corretamente.
- **View e eventos (dependem do navegador):** checklist manual mapeado item a item na tabela da seção 4, executado no navegador com o DevTools aberto, com o resultado documentado (print ou vídeo curto) no relatório técnico.
- Responsabilidade de quem implementa o item 1.1 (Frontend, seção 6) — inclusive os testes.

### Backend

- **Model e ViewModel:** testes unitários com `package:test` (padrão do Dart), usando um `CatalogStore` fake/in-memory para não depender de estado real. Cobre as regras de negócio (ex.: `Product.hasStock`) e a orquestração dos ViewModels.
- **Rotas:** testes de integração chamando o `Handler` do Shelf diretamente com um `Request` construído à mão, sem precisar subir o servidor HTTP — cobre especificamente os cenários de erro do contrato (404, 409, 500) da seção 2.
- Roda com `dart test`.
- Responsabilidade de quem implementa o item 1.2 (Backend, seção 6) — inclusive os testes.

### Casos mínimos a cobrir

| Caso | Onde |
|---|---|
| Validação de estoque com sucesso e com item indisponível (409) | Backend — `cart_view_model` |
| Criação de pedido e conflito de estoque no momento da finalização (409) | Backend — `order_view_model` |
| Produto inexistente (404) | Backend — `product_view_model` |
| Delegação de clique adicionando item ao carrinho | Frontend — manual, checklist |
| Bloqueio de submit com formulário inválido | Frontend — manual, checklist |
| Toast de notificação some após o tempo definido | Frontend — manual, checklist |
| Listener removido ao remover item do carrinho (sem leak) | Frontend — manual, checklist |

---

## 6. Papéis do grupo

- **Líder técnico:** organiza o repositório, define o contrato da API e a divisão de camadas, revisa e integra frontend e backend, consolida os resultados do checklist manual (seção 5) no relatório técnico, participa da seção "Uso de IA" do relatório.
- **Frontend:** implementa a estrutura Model/View/ViewModel/services/events do item 1.1, incluindo os testes unitários de Model/ViewModel e a execução do checklist manual da seção 5.
- **Backend (Dart):** implementa a estrutura Model/ViewModel/View do item 1.2, incluindo os testes com `package:test` da seção 5.

Commits identificáveis de cada integrante nos próprios arquivos de responsabilidade.

---

## 7. Uso de Inteligência Artificial

Uso permitido: dúvidas conceituais, revisão e depuração de código já escrito pelo próprio grupo, explicação de mensagens de erro, exemplos isolados para entender um conceito antes de aplicá-lo ao projeto.

Uso não permitido: solicitar a geração de funcionalidades completas para simples cópia e colagem, ou ocultar o uso da ferramenta quando questionado.

**Frontend:** revisão de ViewModels e do mecanismo Observable; dúvidas sobre separação entre comando (ViewModel) e manipulação de DOM (View/eventos).

**Backend:** revisão de handlers e da separação Model/ViewModel/View; dúvidas sobre CORS, roteamento e estruturação de ViewModels em Dart.

**Líder técnico:** simulação de perguntas de banca sobre a integração frontend-backend; revisão de consistência entre as duas camadas.

**Registro de uso (relatório técnico):**

| Integrante | Ferramenta | Etapa/funcionalidade | Finalidade | Exemplo de prompt usado | Como a resposta foi validada/adaptada |
|---|---|---|---|---|---|
| | | | | | |

---

## 8. Cronograma

- **Entrega 1 — Proposta:** tema, papéis, arquitetura e contrato de API definidos.
- **Entrega 2 — Protótipo parcial:** estrutura Model/View/ViewModel criada nos dois lados; `GET /products` funcionando; catálogo renderizado; pelo menos 1 evento de mouse e 1 de teclado implementados.
- **Entrega 3 — Aplicação completa:** todos os requisitos técnicos da seção 4 cobertos; testes mínimos da seção 5 escritos e passando; repositório com commits de todos os integrantes.
- **Entrega 4 — Apresentação e relatório:** relatório técnico com a seção "Uso de IA" preenchida.