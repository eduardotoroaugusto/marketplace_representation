// js/events/domEvents.js

function setupDomEvents() {
  setupAuthEvents();
  setupNavEvents();
  setupCatalogEvents();
  setupProfileEvents();
  setupComprasEvents();
  setupNotificationsEvents();
  setupGameEvents();
}

function doLogout() {
  // O carrinho sai antes do authEmail, que é usado para montar a chave dele
  localStorage.removeItem(userKey('cart'));
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
  localStorage.removeItem('authEmail');
  window.location.href = 'index.html';
}

// ============================================================
// Tela de Login / Cadastro
// ============================================================
function setupAuthEvents() {
  // Abas: trocam o modo no ViewModel (comando), a View reage
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  if (tabLogin) tabLogin.addEventListener('click', () => authViewModel.setMode(true));
  if (tabRegister) tabRegister.addEventListener('click', () => authViewModel.setMode(false));

  // Submit do login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      authViewModel.login(
        document.getElementById('email').value,
        document.getElementById('password').value
      );
    });
  }

  // Submit do cadastro
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      authViewModel.register(
        document.getElementById('reg-name').value,
        document.getElementById('reg-email').value,
        document.getElementById('reg-password').value,
        document.getElementById('reg-confirm-password').value
      );
    });
  }

  // Validação em tempo real dos campos (requisito: formulário com blur/change)
  const authForms = document.querySelectorAll('.auth-form');
  authForms.forEach(form => {
    form.querySelectorAll('input[data-field]').forEach(input => {
      input.addEventListener('blur', () => {
        const field = input.dataset.field;
        const extra = field === 'confirmPassword'
          ? { password: document.getElementById('reg-password').value }
          : {};
        authViewModel.validateField(field, input.value, extra);
      });
      input.addEventListener('input', () => {
        authViewModel.clearFieldError(input.dataset.field);
      });
    });
  });

  // Mostrar / ocultar senha (comportamento puramente de DOM)
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      btn.classList.toggle('revealed', isHidden);
      btn.setAttribute('aria-label', isHidden ? 'Ocultar senha' : 'Mostrar senha');
    });
  });

  // Botões "Entrar com Google" (mock)
  document.querySelectorAll('.btn-google').forEach(btn => {
    btn.addEventListener('click', () => authViewModel.googleAuth());
  });
}

// ============================================================
// Navegação compartilhada (top-nav de Home e Perfil)
// ============================================================
function setupNavEvents() {
  // Menu do usuário: abre/fecha o dropdown; fecha ao clicar fora
  const userMenu = document.getElementById('user-menu');
  const userDropdown = document.getElementById('user-dropdown');
  if (userMenu && userDropdown) {
    userMenu.addEventListener('click', (e) => {
      if (e.target.closest('#btn-logout')) return;
      userDropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
      if (!userMenu.contains(e.target)) userDropdown.classList.add('hidden');
    });
  }

  // Logout (item do dropdown)
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) btnLogout.addEventListener('click', doLogout);

  // Busca fora da Home: Enter leva para o catálogo
  const searchInput = document.getElementById('search-input');
  if (searchInput && !document.getElementById('catalog-grid')) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        window.location.href = 'catalogo.html';
      }
    });
  }

  // Sino: abre a central de notificações (exceto se já estivermos nela)
  const btnNotif = document.getElementById('btn-notif');
  if (btnNotif && !document.getElementById('notif-list')) {
    btnNotif.addEventListener('click', () => {
      window.location.href = 'notificacoes.html';
    });
  }
}

// ============================================================
// Tela de Catálogo (Home)
// ============================================================
function setupCatalogEvents() {
  const catalogGrid = document.getElementById('catalog-grid');
  if (!catalogGrid) return; // só executa na Home

  // Busca de produtos em tempo real (teclado)
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => catalogViewModel.setSearch(e.target.value));
  }

  // Filtro por categoria (delegação no container da lista)
  const categoryList = document.getElementById('category-list');
  if (categoryList) {
    categoryList.addEventListener('click', (e) => {
      const item = e.target.closest('.category-item');
      if (item) catalogViewModel.setCategory(item.dataset.category);
    });
  }

  // Ordenação
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => catalogViewModel.setSort(e.target.value));
  }

  // Mouse: destaque do card (delegação)
  catalogGrid.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.product-card');
    if (card) card.classList.add('highlight');
  });
  catalogGrid.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.product-card');
    if (card) card.classList.remove('highlight');
  });

  // Clique: adicionar ao carrinho (delegação — funciona para cards criados após o fetch)
  catalogGrid.addEventListener('click', (e) => {
    const btnAdd = e.target.closest('.btn-add-cart');
    if (btnAdd && !btnAdd.disabled) {
      const productId = parseInt(btnAdd.getAttribute('data-id'), 10);
      const product = catalogViewModel.allProducts.find(p => p.id === productId);
      if (product) cartViewModel.addItem(product);
    }
  });
}

// ============================================================
// Tela de Perfil do Usuário
// ============================================================
function setupProfileEvents() {
  const form = document.getElementById('profile-form');
  if (!form) return; // só executa no Perfil

  // Validação em tempo real dos campos editáveis (blur/change)
  form.querySelectorAll('input[data-field]:not([readonly])').forEach(input => {
    input.addEventListener('input', () => {
      profileViewModel.updateField(input.dataset.field, input.value);
      profileViewModel.clearFieldError(input.dataset.field);
    });
    input.addEventListener('blur', () => {
      profileViewModel.validateField(input.dataset.field, input.value);
    });
  });

  // Salvar alterações
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    profileViewModel.save();
  });

  // Sair da Conta
  const btnLogoutAccount = document.getElementById('btn-logout-account');
  if (btnLogoutAccount) btnLogoutAccount.addEventListener('click', doLogout);

  // Alterar foto de perfil (mock)
  const btnChangePhoto = document.getElementById('btn-change-photo');
  if (btnChangePhoto) {
    btnChangePhoto.addEventListener('click', (e) => {
      e.preventDefault();
      profileViewModel.state.value = {
        ...profileViewModel.state.value,
        feedback: { type: 'info', text: 'Troca de foto ainda não disponível neste protótipo.' }
      };
    });
  }

  // Itens do menu lateral ainda sem tela (mock)
  const sidebarMenu = document.getElementById('sidebar-menu');
  if (sidebarMenu) {
    sidebarMenu.addEventListener('click', (e) => {
      const item = e.target.closest('.menu-item');
      if (item && !item.classList.contains('active')) {
        profileViewModel.state.value = {
          ...profileViewModel.state.value,
          feedback: { type: 'info', text: 'Esta seção ainda será implementada.' }
        };
      }
    });
  }
}

// ============================================================
// Tela de Compras (Carrinho)
// ============================================================
function setupComprasEvents() {
  const couponInput = document.getElementById('coupon-input');
  if (!couponInput) return; // só executa na tela de compras

  const applyCoupon = () => cartViewModel.applyCoupon(couponInput.value);

  // Aplicar cupom pelo botão
  const btnApply = document.getElementById('btn-apply-coupon');
  if (btnApply) btnApply.addEventListener('click', applyCoupon);

  // Aplicar cupom pelo teclado (Enter)
  couponInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyCoupon();
    }
  });

  // Resgatar / remover pontos do Cosmo Arcade
  const btnRedeem = document.getElementById('btn-redeem-points');
  if (btnRedeem) btnRedeem.addEventListener('click', () => cartViewModel.togglePoints());

  // Finalizar compra
  const btnCheckout = document.getElementById('btn-checkout');
  if (btnCheckout) btnCheckout.addEventListener('click', () => cartViewModel.checkout());
}

// ============================================================
// Central de Notificações
// ============================================================
function setupNotificationsEvents() {
  const list = document.getElementById('notif-list');
  if (!list) return; // só executa na central de notificações

  // Delegação: remover (lixeira) ou marcar como lida (clicar na notificação)
  list.addEventListener('click', (e) => {
    const row = e.target.closest('.notif-row');
    if (!row) return;
    const id = parseInt(row.dataset.id, 10);

    if (e.target.closest('.notif-delete')) {
      notificationViewModel.remove(id);
    } else {
      notificationViewModel.markRead(id);
    }
  });

  // Marcar todas como lidas
  const markAll = document.getElementById('mark-all-read');
  if (markAll) {
    markAll.addEventListener('click', (e) => {
      e.preventDefault();
      notificationViewModel.markAllRead();
    });
  }
}

// ============================================================
// Jogos (Cosmo Arcade)
// ============================================================
function setupGameEvents() {
  const btnPlay = document.getElementById('btn-play');
  if (!btnPlay) return; // só executa na tela de jogos

  // Botão principal: jogar / reiniciar (pede confirmação durante a partida)
  btnPlay.addEventListener('click', () => gameViewModel.primaryAction());

  document.getElementById('btn-confirm-restart')
    .addEventListener('click', () => gameViewModel.confirmRestart());
  document.getElementById('btn-cancel-restart')
    .addEventListener('click', () => gameViewModel.cancelRestart());

  // Teclado: setas/A-D movem, espaço atira; ESC fecha a confirmação
  const KEY_ACTIONS = {
    ArrowLeft: 'left', a: 'left', A: 'left',
    ArrowRight: 'right', d: 'right', D: 'right',
    ' ': 'fire'
  };

  const handleKey = (pressed) => (e) => {
    if (e.key === 'Escape' && pressed) {
      gameViewModel.cancelRestart();
      return;
    }
    const action = KEY_ACTIONS[e.key];
    if (!action || !gameViewModel.isPlaying()) return;
    if (e.target.closest && e.target.closest('input, textarea')) return; // digitando na busca
    e.preventDefault(); // evita rolar a página com espaço/setas
    gameViewModel.setInput(action, pressed);
  };

  document.addEventListener('keydown', handleKey(true));
  document.addEventListener('keyup', handleKey(false));

  // Ao trocar de janela as teclas soltas não chegam: zera os comandos
  window.addEventListener('blur', () => gameViewModel.resetInput());

  // Toque (celular): o dedo no monitor guia a nave e mantém o tiro ativo
  const canvas = document.getElementById('game-canvas');
  const monitor = document.getElementById('arcade-monitor');
  const toGameX = (clientX) => {
    const rect = canvas.getBoundingClientRect();
    return (clientX - rect.left) / rect.width * gameViewModel.layout.width;
  };
  const handlePointer = (e) => {
    if (e.pointerType === 'mouse' || !gameViewModel.isPlaying()) return;
    e.preventDefault(); // não rola a página nem dá zoom enquanto joga
    gameViewModel.setTouchTarget(toGameX(e.clientX));
  };
  const releasePointer = (e) => {
    if (e.pointerType === 'mouse') return;
    gameViewModel.setTouchTarget(null);
  };
  monitor.addEventListener('pointerdown', handlePointer);
  monitor.addEventListener('pointermove', handlePointer);
  monitor.addEventListener('pointerup', releasePointer);
  monitor.addEventListener('pointercancel', releasePointer);
  monitor.addEventListener('pointerleave', releasePointer);
}
