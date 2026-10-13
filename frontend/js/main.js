// js/main.js

// Ponto de entrada (Main)
document.addEventListener('DOMContentLoaded', () => {

  // 1. Tela de LOGIN / CADASTRO
  const loginFormExists = document.getElementById('login-form');
  if (loginFormExists) {
    const loginView = new LoginView(authViewModel);
    loginView.init();
  }

  // 2. Tela de CATÁLOGO (Home)
  const catalogGridExists = document.getElementById('catalog-grid');
  if (catalogGridExists) {
    const catalogView = new CatalogView(catalogViewModel);
    catalogView.init();

    const cartView = new CartView(cartViewModel);
    cartView.init();

    fillUserHeader();
    catalogViewModel.loadProducts();
  }

  // 3. Tela de PERFIL
  const profileFormExists = document.getElementById('profile-form');
  if (profileFormExists) {
    const profileView = new ProfileView(profileViewModel);
    profileView.init();

    const cartView = new CartView(cartViewModel);
    cartView.init();

    fillUserHeader();
    profileViewModel.loadProfile();
  }

  // 4. Tela de COMPRAS (Carrinho)
  const cartListExists = document.getElementById('cart-items-list');
  if (cartListExists) {
    const cartPageView = new CartPageView(cartViewModel);
    cartPageView.init();

    const cartView = new CartView(cartViewModel);
    cartView.init();

    fillUserHeader();
    fillDeliveryAddress();
    cartViewModel.loadPoints();
  }

  // 5. Central de NOTIFICAÇÕES
  const notifListExists = document.getElementById('notif-list');
  if (notifListExists) {
    const notificationView = new NotificationView(notificationViewModel);
    notificationView.init();

    const cartView = new CartView(cartViewModel);
    cartView.init();

    fillUserHeader();
    notificationViewModel.loadNotifications();
  }

  // 6. JOGOS (Cosmo Arcade)
  const gameCanvasExists = document.getElementById('game-canvas');
  if (gameCanvasExists) {
    const gameView = new GameView(gameViewModel);
    gameView.init();

    const cartView = new CartView(cartViewModel);
    cartView.init();

    fillUserHeader();
    gameViewModel.loadStats();
  }

  // 7. Escutadores de eventos do DOM
  setupDomEvents();
});

// Preenche o endereço de entrega com o logradouro salvo no perfil (se houver)
function fillDeliveryAddress() {
  const el = document.getElementById('delivery-address');
  if (!el) return;
  const perfil = JSON.parse(localStorage.getItem(userKey('userProfile')) || 'null');
  if (perfil && perfil.address) {
    el.textContent = `${perfil.address} - São Paulo, SP`;
  }
}

// Preenche o nome e as iniciais do usuário logado no cabeçalho
function fillUserHeader() {
  const nome = (localStorage.getItem('authUser') || '').trim();
  const nameEl = document.getElementById('user-name');
  const initialsEl = document.getElementById('user-initials');

  if (!nome) return;

  const partes = nome.split(/\s+/);
  if (nameEl) nameEl.textContent = partes[0]; // primeiro nome
  if (initialsEl) {
    const iniciais = partes.slice(0, 2).map(p => p[0].toUpperCase()).join('');
    initialsEl.textContent = iniciais;
  }
}
