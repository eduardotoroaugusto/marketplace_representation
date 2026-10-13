// js/viewmodels/cartViewModel.js

const CART_STORAGE_KEY = 'cart';
// código -> percentual de desconto (WIRE15 é o cupom anunciado nas notificações)
const CUPONS = { 'PROMO10': 0.10, 'WIRE15': 0.15 };

class CartViewModel {
  constructor() {
    const items = this._load();
    this.state = new Observable({
      items,
      couponCode: null,
      couponError: null,
      points: 0,               // saldo do Cosmo Arcade
      pointsRedeem: null,      // faixa resgatada: { points, value }
      pointsError: null,
      error: null,
      feedback: null,          // mensagem de checkout
      ...this._totals(items, null, null)
    });

    // Persiste automaticamente os itens a cada mudança de estado
    this.state.subscribe(state => this._save(state.items));
  }

  // ---------- Comandos ----------
  addItem(product) {
    const items = [...this.state.value.items];
    const idx = items.findIndex(item => item.product.id === product.id);

    if (idx >= 0) {
      const item = items[idx];
      if (item.quantity < product.stock) {
        item.quantity += 1;
      } else {
        this._patch({ error: `Estoque máximo atingido para ${product.name}.` });
        this.clearErrorAfter(3000);
        return;
      }
    } else if (product.stock > 0) {
      items.push(new CartItem(product, 1));
    }

    this._recompute(items, { error: null });
  }

  increaseQty(productId) {
    const items = [...this.state.value.items];
    const item = items.find(i => i.product.id === productId);
    if (!item) return;
    if (item.quantity < item.product.stock) {
      item.quantity += 1;
      this._recompute(items, { error: null });
    } else {
      this._patch({ error: `Estoque máximo atingido para ${item.product.name}.` });
      this.clearErrorAfter(3000);
    }
  }

  decreaseQty(productId) {
    let items = [...this.state.value.items];
    const item = items.find(i => i.product.id === productId);
    if (!item) return;
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      items = items.filter(i => i.product.id !== productId);
    }
    this._recompute(items, { error: null });
  }

  removeItem(productId) {
    const items = this.state.value.items.filter(i => i.product.id !== productId);
    this._recompute(items, { error: null });
  }

  applyCoupon(code) {
    const normalized = (code || '').trim().toUpperCase();
    if (!normalized) {
      this._recompute(this.state.value.items, { couponCode: null, couponError: 'Informe um código de cupom.' });
      return;
    }
    if (CUPONS[normalized]) {
      this._recompute(this.state.value.items, { couponCode: normalized, couponError: null });
    } else {
      this._recompute(this.state.value.items, { couponCode: null, couponError: 'Cupom inválido.' });
    }
  }

  // Saldo de pontos ganho na tela de Jogos
  async loadPoints() {
    if (typeof ApiService === 'undefined') return;
    const res = await ApiService.getArcadeStats();
    if (res.ok) this._patch({ points: res.data.points });
  }

  // Usa a maior faixa da tabela de conversão que o saldo permite (ou remove o resgate)
  togglePoints() {
    if (this.state.value.pointsRedeem) {
      this._recompute(this.state.value.items, { pointsRedeem: null, pointsError: null });
      return;
    }
    const tier = bestPointTier(this.state.value.points);
    if (!tier) {
      this._patch({ pointsError: `Você precisa de pelo menos ${POINT_TIERS[POINT_TIERS.length - 1].points} pontos.` });
      return;
    }
    this._recompute(this.state.value.items, { pointsRedeem: tier, pointsError: null });
  }

  async checkout() {
    if (this.state.value.items.length === 0) {
      this._patch({ feedback: { type: 'error', text: 'Seu carrinho está vazio.' } });
      return;
    }

    // Debita os pontos resgatados antes de confirmar o pedido
    const { pointsRedeem } = this.state.value;
    let points = this.state.value.points;
    if (pointsRedeem) {
      const res = await ApiService.spendPoints(pointsRedeem.points);
      if (!res.ok) {
        this._recompute(this.state.value.items, { pointsRedeem: null, pointsError: res.error });
        return;
      }
      points = res.points;
    }

    // Sem backend: apenas simula o pedido, limpa o carrinho e confirma
    this._recompute([], {
      couponCode: null,
      couponError: null,
      points,
      pointsRedeem: null,
      pointsError: null,
      feedback: { type: 'success', text: 'Compra finalizada com sucesso! (protótipo)' }
    });
  }

  clearErrorAfter(ms) {
    setTimeout(() => this._patch({ error: null }), ms);
  }

  // ---------- Cálculo e atualização de estado ----------
  _totals(items, couponCode, pointsRedeem) {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const rate = couponCode && CUPONS[couponCode] ? CUPONS[couponCode] : 0;
    const pointsValue = pointsRedeem ? pointsRedeem.value : 0;
    const discount = Math.min(subtotal, subtotal * rate + pointsValue); // nunca passa do subtotal
    const total = subtotal - discount;
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, discount, total, count };
  }

  // Recalcula os totais mantendo cupom/pontos atuais (ou os novos passados em extra)
  _recompute(items, extra = {}) {
    const couponCode = 'couponCode' in extra ? extra.couponCode : this.state.value.couponCode;
    const pointsRedeem = 'pointsRedeem' in extra ? extra.pointsRedeem : this.state.value.pointsRedeem;
    this.state.value = {
      ...this.state.value,
      items,
      ...this._totals(items, couponCode, pointsRedeem),
      ...extra
    };
  }

  _patch(props) {
    this.state.value = { ...this.state.value, ...props };
  }

  // ---------- Persistência em localStorage ----------
  _load() {
    if (typeof Product === 'undefined' || typeof CartItem === 'undefined') return [];
    try {
      const raw = localStorage.getItem(userKey(CART_STORAGE_KEY));
      if (!raw) return [];
      const data = JSON.parse(raw);
      return data.map(entry => new CartItem(new Product(entry.product), entry.quantity));
    } catch (err) {
      return [];
    }
  }

  _save(items) {
    const data = items.map(item => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        stock: item.product.stock,
        category: item.product.category,
        rating: item.product.rating
      },
      quantity: item.quantity
    }));
    localStorage.setItem(userKey(CART_STORAGE_KEY), JSON.stringify(data));
  }
}

const cartViewModel = new CartViewModel();
