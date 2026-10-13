// js/services/api.js
//
// Camada de acesso à API em Dart (backend/). Os ViewModels só falam com o
// ApiService; nenhum outro arquivo usa fetch diretamente.
//
// Toda função devolve um objeto no formato { ok: true, ...dados } ou
// { ok: false, error, code, status, details }, então os ViewModels tratam
// sucesso e erro sem try/catch espalhado. Valores em dinheiro chegam em reais.

// Chave do localStorage separada por usuário logado (ex.: 'cart:joao@email.com').
// Hoje só o carrinho fica no navegador; o resto (perfil, pontos, notificações,
// pedidos) vive no servidor.
function userKey(base) {
  return `${base}:${localStorage.getItem('authEmail') || ''}`;
}

// Requisição genérica: monta a URL, envia o token e converte a resposta.
async function apiRequest(method, path, { body, auth = false } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) headers['Authorization'] = `Bearer ${localStorage.getItem('authToken') || ''}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch (err) {
    // Servidor desligado, porta errada ou CORS bloqueado
    return {
      ok: false, status: 0, code: 'network_error',
      error: 'Não foi possível conectar ao servidor. Verifique se a API está rodando.'
    };
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (response.ok) return { ok: true, status: response.status, data };

  // Sessão expirada (ex.: o servidor reiniciou e perdeu as sessões em memória)
  if (auth && response.status === 401) {
    handleExpiredSession();
  }

  return {
    ok: false,
    status: response.status,
    code: data && data.code,
    error: (data && data.error) || `Erro ${response.status} ao falar com o servidor.`,
    details: data && (data.details || data.indisponiveis)
  };
}

// Limpa a sessão local e volta para o login
function handleExpiredSession() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
  localStorage.removeItem('authEmail');
  if (!location.pathname.endsWith('index.html') && location.pathname !== '/') {
    window.location.href = 'index.html';
  }
}

// "há 5 min", "há 2 horas", "há 3 dias" a partir da data ISO do servidor
function timeAgo(isoDate) {
  const seconds = Math.max(0, (Date.now() - new Date(isoDate).getTime()) / 1000);
  if (seconds < 60) return 'agora';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  return `há ${days} dia${days > 1 ? 's' : ''}`;
}

// Converte a notificação da API para o formato do model do frontend
function toNotification(n) {
  return { id: n.id, icon: n.icon, title: n.title, time: timeAgo(n.createdAt), read: n.read };
}

// Converte o estado do arcade da API para o model ArcadeStats do frontend
function toArcadeStats(s) {
  return { points: s.points, hiScore: s.hiScore, playsDate: '', playsToday: s.playsToday };
}

const ApiService = {

  // ---------- Autenticação ----------

  // POST /auth/register
  register: async (name, email, password) => {
    const res = await apiRequest('POST', '/auth/register', { body: { name, email, password } });
    return res.ok ? { ok: true } : res;
  },

  // POST /auth/login — devolve o token e o nome para o cabeçalho
  login: async (email, password) => {
    const res = await apiRequest('POST', '/auth/login', { body: { email, password } });
    if (!res.ok) return res;
    return { ok: true, token: res.data.token, name: res.data.user.name, email: res.data.user.email };
  },

  // POST /auth/logout — invalida o token no servidor
  logout: async () => apiRequest('POST', '/auth/logout', { auth: true }),

  // ---------- Catálogo ----------

  // GET /products
  getProducts: async () => apiRequest('GET', '/products'),

  // ---------- Carrinho e pedidos ----------

  // POST /coupons/validate — { ok, data: { code, percent } }
  validateCoupon: async (code) => apiRequest('POST', '/coupons/validate', { body: { code } }),

  // POST /orders — finaliza a compra
  createOrder: async ({ items, couponCode, usePoints, deliveryAddress }) =>
    apiRequest('POST', '/orders', {
      auth: true,
      body: {
        items: items.map(i => ({ productId: i.product.id, qty: i.quantity })),
        couponCode: couponCode || null,
        usePoints: Boolean(usePoints),
        deliveryAddress
      }
    }),

  // GET /orders — histórico
  getOrders: async () => apiRequest('GET', '/orders', { auth: true }),

  // ---------- Perfil ----------

  // GET /profile
  getProfile: async () => apiRequest('GET', '/profile', { auth: true }),

  // PUT /profile — o nome do cabeçalho acompanha a alteração
  updateProfile: async (data) => {
    const res = await apiRequest('PUT', '/profile', { auth: true, body: data });
    if (res.ok) localStorage.setItem('authUser', res.data.name);
    return res;
  },

  // ---------- Notificações ----------

  // GET /notifications
  getNotifications: async () => {
    const res = await apiRequest('GET', '/notifications', { auth: true });
    return res.ok ? { ok: true, data: res.data.items.map(toNotification) } : res;
  },

  // PATCH /notifications/{id}/read
  markNotificationRead: async (id) => apiRequest('PATCH', `/notifications/${id}/read`, { auth: true }),

  // POST /notifications/read-all
  markAllNotificationsRead: async () => apiRequest('POST', '/notifications/read-all', { auth: true }),

  // DELETE /notifications/{id}
  deleteNotification: async (id) => apiRequest('DELETE', `/notifications/${id}`, { auth: true }),

  // ---------- Cosmo Arcade ----------

  // GET /arcade/stats
  getArcadeStats: async () => {
    const res = await apiRequest('GET', '/arcade/stats', { auth: true });
    return res.ok ? { ok: true, data: toArcadeStats(res.data) } : res;
  },

  // POST /arcade/plays — inicia a partida (já conta no limite do dia)
  startArcadePlay: async () => {
    const res = await apiRequest('POST', '/arcade/plays', { auth: true });
    return res.ok ? { ok: true, playId: res.data.playId, stats: toArcadeStats(res.data.stats) } : res;
  },

  // POST /arcade/plays/{id}/finish — registra a pontuação
  finishArcadePlay: async (playId, score) => {
    const res = await apiRequest('POST', `/arcade/plays/${playId}/finish`, { auth: true, body: { score } });
    return res.ok ? { ok: true, earned: res.data.earned, stats: toArcadeStats(res.data.stats) } : res;
  }
};
