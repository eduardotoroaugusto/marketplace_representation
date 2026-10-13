// js/viewmodels/cartViewModel.js

const CART_STORAGE_KEY = 'cart';

class CartViewModel {
  constructor() {
    const items = this._load();
    this.state = new Observable({
      items,
      couponCode: null,
      couponPercent: 0,        // percentual do cupom validado pela API
      couponError: null,
      points: 0,               // saldo do Cosmo Arcade
      pointsRedeem: null,      // faixa resgatada: { points, value }
      pointsError: null,
      error: null,
      feedback: null,          // mensagem de checkout
      deliveryAddress: null,   // logradouro do perfil (null = ainda carregando)
      isCheckingOut: false,
      ...this._totals(items, 0, null)
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

  // Os cupons válidos ficam no servidor (POST /coupons/validate)
  async applyCoupon(code) {
    const typed = (code || '').trim();
    if (!typed) {
      this._recompute(this.state.value.items, { couponCode: null, couponPercent: 0, couponError: 'Informe um código de cupom.' });
      return;
    }
    const res = await ApiService.validateCoupon(typed);
    if (res.ok) {
      this._recompute(this.state.value.items, { couponCode: res.data.code, couponPercent: res.data.percent, couponError: null });
    } else {
      this._recompute(this.state.value.items, { couponCode: null, couponPercent: 0, couponError: res.error });
    }
  }

  // Endereço de entrega = logradouro salvo no Perfil (GET /profile)
  async loadDeliveryAddress() {
    if (typeof ApiService === 'undefined') return;
    const res = await ApiService.getProfile();
    this._patch({ deliveryAddress: res.ok ? res.data.address : '' });
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

  // POST /orders: o servidor confere o estoque de novo, calcula os valores,
  // baixa o estoque e debita os pontos
  async checkout() {
    const { items, couponCode, pointsRedeem, deliveryAddress, isCheckingOut } = this.state.value;
    if (isCheckingOut) return;
    if (items.length === 0) {
      this._patch({ feedback: { type: 'error', text: 'Seu carrinho está vazio.' } });
      return;
    }

    this._patch({ isCheckingOut: true, feedback: null });
    const res = await ApiService.createOrder({ items, couponCode, usePoints: Boolean(pointsRedeem), deliveryAddress });

    if (!res.ok) {
      this._patch({ isCheckingOut: false, feedback: { type: 'error', text: this._checkoutError(res) } });
      return;
    }

    const order = res.data.order;
    this._recompute([], {
      isCheckingOut: false,
      couponCode: null,
      couponPercent: 0,
      couponError: null,
      points: this.state.value.points - order.pointsUsed,
      pointsRedeem: null,
      pointsError: null,
      feedback: {
        type: 'success',
        text: `Pedido #${order.id} confirmado! Total pago: R$ ${order.total.toFixed(2).replace('.', ',')}.`
      }
    });
  }

  // Mensagem de erro do checkout a partir da resposta da API
  _checkoutError(res) {
    if (res.code === 'stock_unavailable' && Array.isArray(res.details)) {
      const nomes = res.details.map(i => `${i.name || 'Produto ' + i.productId} (disponível: ${i.available})`);
      return `Estoque insuficiente: ${nomes.join(', ')}.`;
    }
    if (res.code === 'validation_error' && res.details && res.details.deliveryAddress) {
      return 'Cadastre seu endereço de entrega no Perfil antes de finalizar.';
    }
    return res.error;
  }

  clearErrorAfter(ms) {
    setTimeout(() => this._patch({ error: null }), ms);
  }

  // ---------- Cálculo e atualização de estado ----------
  // Prévia dos valores (em centavos para não acumular erro de arredondamento).
  // O valor final é sempre o calculado pelo servidor em POST /orders.
  _totals(items, couponPercent, pointsRedeem) {
    const subtotalCents = Math.round(items.reduce((sum, item) => sum + item.subtotal, 0) * 100);
    const couponCents = Math.round(subtotalCents * couponPercent / 100);
    const pointsCents = pointsRedeem ? Math.round(pointsRedeem.value * 100) : 0;
    const discountCents = Math.min(subtotalCents, couponCents + pointsCents); // nunca passa do subtotal
    const subtotal = subtotalCents / 100;
    const discount = discountCents / 100;
    const total = (subtotalCents - discountCents) / 100;
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, discount, total, count };
  }

  // Recalcula os totais mantendo cupom/pontos atuais (ou os novos passados em extra)
  _recompute(items, extra = {}) {
    const couponPercent = 'couponPercent' in extra ? extra.couponPercent : this.state.value.couponPercent;
    const pointsRedeem = 'pointsRedeem' in extra ? extra.pointsRedeem : this.state.value.pointsRedeem;
    this.state.value = {
      ...this.state.value,
      items,
      ...this._totals(items, couponPercent, pointsRedeem),
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
