# Documentação do Frontend

Frontend do **Carrinho de Compras Interativo** — HTML5, CSS3 e JavaScript puro (sem frameworks), organizado no padrão **MVVM** e orientado a eventos. Consome a API em Dart descrita em [`backend/README.md`](../backend/README.md) e documentada no Swagger (`http://localhost:8081/docs`).

---

## Sumário

1. [Como rodar](#1-como-rodar)
2. [Visão geral da arquitetura](#2-visão-geral-da-arquitetura)
3. [Estrutura de pastas](#3-estrutura-de-pastas)
4. [O núcleo: `Observable`](#4-o-núcleo-observable)
5. [Fluxo de um evento, ponta a ponta](#5-fluxo-de-um-evento-ponta-a-ponta)
6. [Camada de serviço: `api.js` e `config.js`](#6-camada-de-serviço-apijs-e-configjs)
7. [Models](#7-models)
8. [ViewModels](#8-viewmodels)
9. [Views](#9-views)
10. [Eventos (`domEvents.js`)](#10-eventos-domeventsjs)
11. [Telas](#11-telas)
12. [Sessão, autenticação e armazenamento local](#12-sessão-autenticação-e-armazenamento-local)
13. [Layout responsivo (mobile)](#13-layout-responsivo-mobile)
14. [Estilos e design tokens](#14-estilos-e-design-tokens)
15. [Requisitos do edital — onde cada um está](#15-requisitos-do-edital--onde-cada-um-está)
16. [Como testar](#16-como-testar)
17. [Limitações conhecidas](#17-limitações-conhecidas)

---

## 1. Como rodar

O frontend são arquivos estáticos, mas **precisa ser servido por HTTP** (abrir o `index.html` direto com `file://` bloqueia as requisições à API por CORS).

```bash
# 1) Suba a API (em outro terminal) — ver backend/README.md
cd backend
dart run bin/server.dart          # http://localhost:8081

# 2) Sirva o frontend na porta 5500
cd frontend
python -m http.server 5500        # ou a extensão Live Server do VS Code
```

Abra `http://localhost:5500/index.html`, crie uma conta na aba **Criar conta** e entre.

| Item | Valor padrão | Onde mudar |
|---|---|---|
| Endereço da API | `http://localhost:8081` | `frontend/js/services/config.js` (`API_BASE_URL`) |
| Origem liberada no CORS da API | `http://localhost:5500` e `http://127.0.0.1:5500` | `backend/.env` (`ALLOWED_ORIGINS`) |

> Se o frontend rodar em outra porta, adicione essa origem em `ALLOWED_ORIGINS` no backend; senão o navegador bloqueia as chamadas.

---

## 2. Visão geral da arquitetura

```
 Usuário
   │  clique, tecla, toque, submit
   ▼
 events/domEvents.js ── captura o evento e chama um COMANDO ──┐
                                                             ▼
                                              viewmodels/*ViewModel.js
                                       (regras da tela + estado em Observable)
                                          │                     │
                          chama a API     │                     │ state.value = {...}
                                          ▼                     ▼
                              services/api.js          views/*View.js (inscritas no Observable)
                                  │ fetch                          │
                                  ▼                                ▼
                         API Dart (backend)                  re-renderiza o DOM
```

Regras de cada camada:

| Camada | Pode | Não pode |
|---|---|---|
| **Model** (`js/models`) | Representar dados e regras puras (ex.: `CartItem.subtotal`, `bestPointTier`) | Tocar no DOM ou chamar a API |
| **ViewModel** (`js/viewmodels`) | Guardar o estado da tela num `Observable`, expor comandos, chamar o `ApiService` | Tocar no DOM |
| **View** (`js/views`) | Ler o estado e desenhar o DOM | Ter regra de negócio ou chamar a API |
| **Eventos** (`js/events/domEvents.js`) | Registrar listeners e traduzir eventos em comandos do ViewModel | Alterar o DOM diretamente (exceção: o arrasto visual das notificações) |
| **Serviço** (`js/services/api.js`) | Falar com a API (`fetch`) e converter respostas | Conhecer telas ou DOM |
| **`main.js`** | Descobrir qual página está aberta e ligar View ↔ ViewModel | — |

Não há módulos ES nem bundler: cada página carrega seus scripts com `<script>` na ordem **core → models → services → viewmodels → views → events → main**, e os objetos ficam globais (ex.: `cartViewModel`, `ApiService`).

---

## 3. Estrutura de pastas

```
frontend/
├── index.html            Login / Cadastro
├── catalogo.html         Home (catálogo)
├── compras.html          Carrinho e finalização
├── perfil.html           Perfil do usuário
├── notificacoes.html     Central de notificações
├── jogos.html            Cosmo Arcade (Space Invaders)
├── css/
│   └── styles.css        Todos os estilos (desktop + media queries mobile)
├── assets/icons/         Ícones SVG exportados do Figma
└── js/
    ├── core/
    │   └── observable.js         Mecanismo de binding (padrão Observer)
    ├── models/
    │   ├── product.js            Produto (inStock)
    │   ├── cartItem.js           Item do carrinho (subtotal)
    │   ├── userProfile.js        Dados do perfil
    │   ├── notification.js       Notificação
    │   ├── arcadeStats.js        Saldo/limite do arcade + tabela de conversão
    │   └── cosmoGame.js          Simulação do jogo (sem DOM)
    ├── services/
    │   ├── config.js             API_BASE_URL
    │   └── api.js                ApiService (todas as chamadas HTTP)
    ├── viewmodels/
    │   ├── authViewModel.js
    │   ├── catalogViewModel.js
    │   ├── cartViewModel.js
    │   ├── profileViewModel.js
    │   ├── notificationViewModel.js
    │   └── gameViewModel.js
    ├── views/
    │   ├── loginView.js
    │   ├── catalogView.js
    │   ├── cartView.js           Contador do carrinho (cabeçalho)
    │   ├── cartPageView.js       Tela de Compras
    │   ├── profileView.js
    │   ├── notificationView.js
    │   └── gameView.js           Canvas + HUD do jogo
    ├── events/
    │   └── domEvents.js          Todos os listeners de eventos
    └── main.js                   Ponto de entrada de cada página
```

---

## 4. O núcleo: `Observable`

`js/core/observable.js` é o mecanismo de *data binding* de todo o app:

```js
class Observable {
  #listeners = [];
  #value;
  constructor(initial) { this.#value = initial; }
  get value() { return this.#value; }
  set value(v) { this.#value = v; this.#listeners.forEach(fn => fn(v)); }
  subscribe(fn) { this.#listeners.push(fn); fn(this.#value); return () => { /* cancela */ }; }
}
```

- Cada ViewModel tem um `this.state = new Observable({...})`.
- Atribuir `state.value = { ...state.value, campo: novo }` **notifica todos os inscritos**.
- A View chama `viewModel.state.subscribe(state => this.render(state))` no `init()` e passa a re-renderizar a cada mudança.
- O estado é sempre **substituído** (objeto novo com spread), nunca mutado no lugar — assim cada notificação entrega um retrato completo da tela.

---

## 5. Fluxo de um evento, ponta a ponta

Exemplo: clicar em **“Adicionar ao carrinho”** na Home.

1. **Evento** — `domEvents.js` tem **um único** listener de `click` no container `#catalog-grid` (delegação). Ele identifica o botão `.btn-add-cart` clicado e lê o `data-id`.
2. **Comando** — chama `cartViewModel.addItem(product)`.
3. **Regra** — o ViewModel confere o estoque (`quantity < product.stock`), monta a nova lista de itens e recalcula os totais.
4. **Estado** — `state.value = {...}` dispara o `Observable`.
5. **Persistência** — o próprio `cartViewModel` está inscrito no seu estado e salva o carrinho no `localStorage` (`cart:<email>`).
6. **View** — `CartView` atualiza o contador do cabeçalho (`#cart-count` e o badge do mobile).

Exemplo assíncrono: **Finalizar compra**.

1. `click` em `#btn-checkout` → `cartViewModel.checkout()`.
2. O ViewModel marca `isCheckingOut: true` (a View desabilita o botão e mostra “Finalizando...”).
3. `ApiService.createOrder(...)` faz `POST /orders`.
4. Sucesso (`201`): esvazia o carrinho e mostra “Pedido #1001 confirmado!”. Erro: mostra a mensagem da API — `409` lista os itens sem estoque; `422` sem endereço pede para completar o Perfil.

---

## 6. Camada de serviço: `api.js` e `config.js`

`ApiService` é a **única** porta de saída para a rede. Toda função devolve um objeto no mesmo formato, então os ViewModels tratam sucesso e erro sem `try/catch` espalhado:

```js
// sucesso
{ ok: true, status: 200, data: {...} }
// erro
{ ok: false, status: 409, code: 'stock_unavailable', error: 'Mensagem para exibir', details: [...] }
// servidor desligado / porta errada / CORS
{ ok: false, status: 0, code: 'network_error', error: 'Não foi possível conectar ao servidor...' }
```

A função interna `apiRequest(method, path, { body, auth })` monta a URL com `API_BASE_URL`, envia o JSON e, quando `auth: true`, o cabeçalho `Authorization: Bearer <token>`.

| Função | Método e rota | Usada por |
|---|---|---|
| `register(name, email, password)` | `POST /auth/register` | `authViewModel.register` |
| `login(email, password)` | `POST /auth/login` | `authViewModel.login` |
| `logout()` | `POST /auth/logout` | `doLogout` (domEvents) |
| `getProducts()` | `GET /products` | `catalogViewModel.loadProducts` |
| `validateCoupon(code)` | `POST /coupons/validate` | `cartViewModel.applyCoupon` |
| `createOrder({items, couponCode, usePoints, deliveryAddress})` | `POST /orders` | `cartViewModel.checkout` |
| `getOrders()` | `GET /orders` | disponível para a aba Histórico |
| `getProfile()` | `GET /profile` | `profileViewModel.loadProfile`, `cartViewModel.loadDeliveryAddress` |
| `updateProfile(data)` | `PUT /profile` | `profileViewModel.save` |
| `getNotifications()` | `GET /notifications` | `notificationViewModel`, badge do sino (`main.js`) |
| `markNotificationRead(id)` | `PATCH /notifications/{id}/read` | `notificationViewModel.markRead` |
| `markAllNotificationsRead()` | `POST /notifications/read-all` | `notificationViewModel.markAllRead` |
| `deleteNotification(id)` | `DELETE /notifications/{id}` | `notificationViewModel.remove` |
| `getArcadeStats()` | `GET /arcade/stats` | `gameViewModel.loadStats`, `cartViewModel.loadPoints` |
| `startArcadePlay()` | `POST /arcade/plays` | `gameViewModel.startGame` |
| `finishArcadePlay(playId, score)` | `POST /arcade/plays/{id}/finish` | `gameViewModel._finishGame` |

Conversões feitas no serviço (para os ViewModels receberem o formato dos Models do front):

- **Notificações:** `createdAt` (ISO) vira o texto relativo `time` (“há 5 min”, “há 2 horas”) — função `timeAgo`.
- **Arcade:** a resposta vira `{ points, hiScore, playsToday }` para o model `ArcadeStats`.
- **Sessão expirada:** se uma rota protegida responde `401`, `handleExpiredSession()` limpa a sessão local e volta para o login (o backend guarda as sessões em memória, então reiniciar o servidor derruba todo mundo).

---

## 7. Models

| Model | Arquivo | Conteúdo |
|---|---|---|
| `Product` | `product.js` | `id, name, price, stock, category, rating`; `inStock` (estoque > 0) |
| `CartItem` | `cartItem.js` | `product, quantity`; `subtotal = price × quantity` |
| `UserProfile` | `userProfile.js` | `name, email (somente leitura), phone, cpf, cep, address` |
| `Notification` | `notification.js` | `id, icon ('package' \| 'alert-triangle' \| 'tag'), title, time, read` |
| `ArcadeStats` | `arcadeStats.js` | `points, hiScore, playsToday`; `playsLeft`. Constantes `MAX_PLAYS_PER_DAY = 3` e `POINT_TIERS` (500 pts = R$ 10, 250 = R$ 5, 100 = R$ 2) + `bestPointTier(saldo)` |
| `CosmoGame` | `cosmoGame.js` | Simulação pura do Space Invaders: nave, tiros, aliens, bombas, colisões, placar, vidas e ondas. Dois layouts (`GAME_LAYOUTS.desktop` 1192×412 e `.mobile` 334×212) com as medidas do Figma |

`CosmoGame` não conhece o DOM: recebe `update(dt, input)` e expõe posições. Isso permite testá-lo em Node e desenhá-lo em qualquer canvas.

---

## 8. ViewModels

Cada ViewModel é uma classe com uma instância global criada no fim do arquivo (ex.: `const cartViewModel = new CartViewModel();`).

### `authViewModel` — Login e Cadastro
- **Estado:** `isLoading`, `isLoginMode`, `feedback`, `fieldErrors`.
- **Comandos:** `setMode(isLogin)`, `validateField(campo, valor)` (no `blur`), `clearFieldError(campo)` (no `input`), `login(email, senha)`, `register(nome, email, senha, confirmação)`, `googleAuth()` (aviso de protótipo).
- **Validações (iguais às do servidor):** nome e sobrenome só com letras; e-mail com `@` e domínio; senha com 8+ caracteres; confirmação igual.
- No login bem-sucedido grava `authToken`, `authUser` e `authEmail` e vai para `catalogo.html`.

### `catalogViewModel` — Home
- **Estado:** `isLoading`, `products` (lista exibida), `error`, `searchQuery`, `category`, `sortBy`.
- **Comandos:** `loadProducts()`, `setSearch(texto)`, `setCategory(cat)`, `setSort('relevance' | 'price-asc' | 'price-desc')`.
- Mantém `allProducts` intacto e deriva a lista exibida em `_apply()` (busca + categoria + ordenação).

### `cartViewModel` — Carrinho (compartilhado por várias páginas)
- **Estado:** `items`, `subtotal`, `discount`, `total`, `count`, `couponCode`, `couponPercent`, `couponError`, `points`, `pointsRedeem`, `pointsError`, `deliveryAddress`, `isCheckingOut`, `feedback`, `error`.
- **Comandos:** `addItem(produto)`, `increaseQty(id)`, `decreaseQty(id)` (remove ao chegar em 0), `removeItem(id)`, `applyCoupon(código)` (async, valida na API), `togglePoints()` (usa/remove a maior faixa de pontos), `loadPoints()`, `loadDeliveryAddress()`, `checkout()` (async).
- **Totais:** calculados em centavos (`_totals`) só como **prévia**; o valor oficial é o devolvido pelo `POST /orders`.
- **Persistência:** o carrinho fica no `localStorage` (`cart:<email>`), sobrevive à troca de página e é limpo no logout.

### `profileViewModel` — Perfil
- **Estado:** `isLoading`, `isSaving`, `profile`, `feedback`, `fieldErrors`.
- **Comandos:** `loadProfile()`, `updateField(campo, valor)`, `validateField(campo, valor)`, `clearFieldError(campo)`, `save()`.
- Valida telefone `(11) 98765-4321`, CPF `123.456.789-00`, CEP `01311-200` e logradouro obrigatório. Se o servidor responder `422`, os erros de cada campo (`details`) aparecem embaixo dos campos.

### `notificationViewModel` — Central de Notificações
- **Estado:** `isLoading`, `notifications`, `unreadCount`, `error`.
- **Comandos:** `loadNotifications()`, `markRead(id)`, `markAllRead()`, `remove(id)`.
- **Atualização otimista:** a tela muda na hora e a API confirma depois; se a API recusar, a lista é recarregada para voltar ao estado real.

### `gameViewModel` — Cosmo Arcade
- **Fases:** `idle` → `playing` → (`confirm`) → `over`.
- **Estado:** `isLoading`, `isStarting`, `phase`, `score`, `lives`, `lastEarned`, `stats` (`ArcadeStats`), `error`.
- **Comandos:** `loadStats()`, `primaryAction()` (jogar/reiniciar), `startGame()` (registra a partida na API — conta no limite do dia), `requestRestart()`, `cancelRestart()`, `confirmRestart()`, `setInput(ação, pressionado)`, `setTouchTarget(x)`, `setLayout('desktop' | 'mobile')`, `tick(dt)` (chamado a cada quadro pela View).
- Ao fim da partida, mostra o resultado na hora e envia a pontuação (`POST /arcade/plays/{id}/finish`); o saldo exibido passa a ser o devolvido pelo servidor.

---

## 9. Views

Toda View segue o mesmo molde: o construtor guarda referências do DOM, `init()` se inscreve no `Observable` e `render(state)` redesenha.

| View | Página | O que desenha |
|---|---|---|
| `LoginView` | index | Abas, erros por campo (borda vermelha + mensagem), feedback, botão em carregamento |
| `CatalogView` | catalogo | Grade de cards (template literal), título de resultados, categoria ativa (lista lateral e chips), sincroniza as duas caixas de busca |
| `CartView` | todas as internas | Contador do carrinho (`#cart-count` e `[data-cart-count]`) |
| `CartPageView` | compras | Linhas do carrinho com stepper, resumo, cupom, pontos, endereço, botão de finalizar e mensagens |
| `ProfileView` | perfil | Preenche o formulário, erros por campo e feedback de salvamento |
| `NotificationView` | notificacoes | Lista, contador “N novas”, ponto de não lida e ícones (desktop e mobile) |
| `GameView` | jogos | Canvas do jogo (loop com `requestAnimationFrame`), placar, vidas, overlays de fim/reinício, botão e limite diário |

Detalhes que valem citar na apresentação:

- **`CartPageView` remove os listeners antes de recriar as linhas** (`_cleanupRowListeners`, com `removeEventListener`), evitando vazamento de memória ao remover itens.
- **`GameView`** só re-desenha o quadro estático quando o loop está parado e adapta o canvas à densidade da tela (`devicePixelRatio`).

---

## 10. Eventos (`domEvents.js`)

`setupDomEvents()` chama um *setup* por tela; cada um retorna cedo se a página atual não tem os elementos dele.

| Função | Eventos registrados |
|---|---|
| `setupAuthEvents` | `click` nas abas; `submit` dos formulários (com `preventDefault`); `blur`/`input` nos campos (validação em tempo real); `click` nos olhos de mostrar senha e no Google |
| `setupNavEvents` | `click` no menu do usuário e fora dele (fecha o dropdown); logout; `keydown` (Enter) na busca fora da Home; `click` no sino |
| `setupCatalogEvents` | `input` nas buscas (desktop e mobile); `click` delegado nas categorias e chips; `change` na ordenação; `mouseover`/`mouseout` delegados (destaque do card); `click` delegado em “Adicionar” |
| `setupProfileEvents` | `input`/`blur` nos campos; `submit` do formulário; logout; “Alterar foto”; menu lateral |
| `setupComprasEvents` | `click` em Aplicar; `keydown` (Enter) no cupom; `click` em Usar pontos e Finalizar |
| `setupNotificationsEvents` | `click` delegado (marcar como lida / excluir); “Marcar todas”/“Lidas”; **arrastar para excluir** (`pointerdown/move/up/cancel`) |
| `setupGameEvents` | `click` em Jogar/Reiniciar/Continuar; `keydown`/`keyup` (setas, A/D, espaço, ESC); `blur` da janela (solta as teclas); **toque** no monitor (`pointer*`) |

---

## 11. Telas

### Login / Cadastro — `index.html`
Abas “Entrar” e “Criar conta”. Validação no `blur` com mensagem embaixo do campo; o erro some ao digitar. Mostrar/ocultar senha. Após cadastrar, volta para “Entrar” com mensagem de sucesso. Quem já está logado é redirecionado para a Home.

### Home — `catalogo.html`
Busca em tempo real, filtro por categoria, ordenação por preço e grade de produtos vinda de `GET /products`. Produto sem estoque mostra “Esgotado” com botão desabilitado. O botão respeita o estoque (não deixa passar do disponível).

### Compras — `compras.html`
Itens com stepper (−/+) e remoção, cupom (Enter ou botão; `PROMO10` 10%, `WIRE15` 15%), uso de pontos do Cosmo Arcade, endereço de entrega (o logradouro do Perfil), resumo e “Finalizar compra” (`POST /orders`).

### Perfil — `perfil.html`
Formulário com nome, e-mail (bloqueado, vem da conta), telefone, CPF, CEP e logradouro. Salvar (`PUT /profile`) atualiza também o nome no cabeçalho. “Sair da conta” encerra a sessão no servidor.

### Notificações — `notificacoes.html`
Lista com ícone por tipo, destaque de não lidas (fundo azul + ponto vermelho), clique para marcar como lida, “Marcar todas como lidas”, excluir (lixeira no desktop; x ou arrastar para o lado no mobile). Pedidos finalizados geram notificação automaticamente.

### Cosmo Arcade — `jogos.html`
Space Invaders em `<canvas>`. Controles: **← →** ou **A/D** movem, **espaço** atira, **ESC** fecha a confirmação de reinício; no celular, **tocar e segurar** no monitor move a nave até o dedo e atira. Limite de **3 partidas por dia** (contadas ao iniciar). Aliens vermelhos valem 20 pontos e amarelos 10; os pontos viram desconto no carrinho (100 pts = R$ 2, 250 = R$ 5, 500 = R$ 10).

---

## 12. Sessão, autenticação e armazenamento local

| Chave do `localStorage` | Conteúdo | Quando muda |
|---|---|---|
| `authToken` | Token Bearer devolvido pela API | Login; removido no logout ou em sessão expirada |
| `authUser` | Nome completo (para o cabeçalho) | Login e ao salvar o Perfil |
| `authEmail` | E-mail da conta | Login |
| `cart:<email>` | Itens do carrinho do usuário | A cada mudança no carrinho; removido no logout |

- **Proteção das páginas internas:** cada uma tem um `<script>` no `<head>` que redireciona para `index.html` se não houver `authToken` + `authEmail` — antes de qualquer conteúdo aparecer.
- **O token é a única identificação do usuário** nas chamadas protegidas; o servidor nunca confia num id enviado pelo cliente.
- Perfil, pontos, partidas, notificações e pedidos **vivem no servidor**; só o carrinho fica no navegador até a finalização.

---

## 13. Layout responsivo (mobile)

Abaixo de **600px** de largura, todas as telas mudam para o layout dos frames mobile do Figma, **na mesma página** (sem HTML duplicado):

- A top-nav some e aparece uma **barra superior por tela** (`.m-topbar`) e a **navegação inferior** fixa (`.bottom-nav`, com a aba atual destacada).
- Classes utilitárias: `.only-mobile` e `.only-desktop` escondem elementos no outro tamanho.
- `display: contents` + `order` reorganizam colunas (Compras, Jogos) sem mudar o HTML.
- Ícones `.mask-icon`: o SVG exportado do Figma vira máscara e é pintado pela cor do texto — a mesma imagem serve para aba ativa e inativa.
- Home: busca e **chips** de categoria roláveis; grade de 2 colunas.
- Notificações: **arrastar para o lado exclui** (90px de arrasto confirma; menos que isso o card volta).
- Jogos: monitor 334×212 com medidas próprias e **controle por toque**.

---

## 14. Estilos e design tokens

Tudo em `css/styles.css`, organizado por tela. Tokens em `:root`:

| Token | Valor | Uso |
|---|---|---|
| `--navy` | `#1B2D50` | Cor primária, textos e botões |
| `--page-bg` | `#F0F8FF` | Fundo das páginas |
| `--card-border` | `#B8CCE0` | Bordas de cards e campos |
| `--tab-bg` | `#E8F4FD` | Destaques e itens ativos |
| `--label` | `#3D5570` | Rótulos |
| `--placeholder` | `#8899AA` | Placeholders e textos secundários |
| `--error` | `#EF4444` | Erros e badges de alerta |
| `--badge` | `#2A3F5C` | Contadores |

Fonte **Inter** em todo o app; a tela de Jogos usa **Unbounded** e **Manrope** (identidade do Cosmo Arcade). Campos com 42px de altura e raio 6px; cards com raio 8px.

---

## 15. Requisitos do edital — onde cada um está

| # | Requisito | Onde |
|---|---|---|
| 1 | Mouse (click, mouseover/mouseout) | `setupCatalogEvents`: `click` em “Adicionar”; `mouseover`/`mouseout` destacam o card |
| 2 | Teclado | `input` na busca (filtro em tempo real); `keydown` Enter no cupom e na busca; teclas do jogo |
| 3 | Formulário | Login, cadastro e perfil: `submit` com `preventDefault`, validação no `blur`/`input` |
| 4 | Delegação de eventos | Um listener em `#catalog-grid` atende os botões criados depois do `fetch`; idem na lista de notificações e nas categorias |
| 5 | Eventos assíncronos | `ApiService` com `async/await` e tratamento de 401/404/409/422/500 e falha de rede |
| 6 | Temporizadores | `setTimeout` em `cartViewModel.clearErrorAfter` (mensagem de estoque some em 3s); `requestAnimationFrame` no loop do jogo |
| 7 | Remoção de listeners | `CartPageView._cleanupRowListeners` chama `removeEventListener` antes de recriar as linhas |
| 8 | 3+ arquivos separados | HTML + CSS + JS em core/models/services/viewmodels/views/events |

---

## 16. Como testar

Checklist manual (DevTools aberto, aba Console sem erros):

1. **Cadastro:** campos inválidos mostram erro no `blur`; e-mail repetido mostra “Este e-mail já está em uso.”.
2. **Login:** senha errada mostra a mensagem do servidor; certo, vai para a Home.
3. **Home:** busca filtra enquanto digita; categoria e ordenação funcionam; “Adicionar” respeita o estoque.
4. **Compras:** stepper e remoção atualizam o resumo; `PROMO10`/`WIRE15` aplicam; cupom inválido mostra erro; “Usar pontos” desconta; sem endereço no Perfil, finalizar avisa; com endereço, gera “Pedido #N confirmado”.
5. **Perfil:** campo inválido mostra erro; salvar atualiza o nome do cabeçalho.
6. **Notificações:** marcar lida, todas, excluir; o pedido feito aparece na lista.
7. **Jogos:** jogar soma pontos (aparecem em Compras); a 4ª partida do dia é bloqueada.
8. **Mobile:** com a janela estreita (≤600px) as telas trocam para o layout mobile; a barra inferior navega entre elas.
9. **Sessão expirada:** reinicie o backend e clique em algo — o app volta para o login.

A lógica do jogo (`CosmoGame`) pode ser testada em Node, carregando o arquivo num contexto `vm` e chamando `update(dt, input)`.

---

## 17. Limitações conhecidas

- **Dados em memória no backend:** reiniciar a API apaga contas, pedidos e sessões (o app volta para o login).
- **“Histórico de pedidos”** ainda é só a aba visual; a API já oferece `GET /orders` (`ApiService.getOrders`).
- **Pagamento e frete são ilustrativos:** não há cobrança real; o frete aparece como “[A calcular]”.
- **Login com Google** é só um aviso de protótipo.
- O limite diário do jogo é do servidor, mas a **pontuação é informada pelo cliente** (o servidor só recusa valores fora de 0–20000) — num produto real, a partida precisaria ser validada no servidor.
