// js/views/cartPageView.js

class CartPageView {
  constructor(viewModel) {
    this.viewModel = viewModel;
    this.listEl = document.getElementById('cart-items-list');
    this.tabCountEl = document.getElementById('cart-tab-count');
    this.summaryCountEl = document.getElementById('summary-count');
    this.subtotalEl = document.getElementById('summary-subtotal');
    this.discountEl = document.getElementById('summary-discount');
    this.totalEl = document.getElementById('summary-total');
    this.couponFeedbackEl = document.getElementById('coupon-feedback');
    this.checkoutFeedbackEl = document.getElementById('cart-feedback');
    this.pointsEl = document.getElementById('cart-points');
    this.redeemBtnEl = document.getElementById('btn-redeem-points');
    this.pointsFeedbackEl = document.getElementById('points-feedback');

    // Listeners por linha, para removê-los antes de recriar o DOM (evita vazamento)
    this._rowListeners = [];
  }

  init() {
    this.viewModel.state.subscribe(state => this.render(state));
  }

  render(state) {
    this.renderItems(state);
    this.renderSummary(state);
    this.renderCouponFeedback(state);
    this.renderPoints(state);
    this.renderCheckoutFeedback(state);
  }

  // ---------- Itens ----------
  renderItems(state) {
    this._cleanupRowListeners();

    if (this.tabCountEl) this.tabCountEl.textContent = state.count;

    if (state.items.length === 0) {
      this.listEl.classList.add('empty');
      this.listEl.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
      return;
    }

    this.listEl.classList.remove('empty');
    this.listEl.innerHTML = '';
    state.items.forEach(item => this.listEl.appendChild(this.createRow(item)));
  }

  createRow(item) {
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div class="cart-thumb">
        <img src="assets/icons/image.svg" alt="" class="icon-24">
        <span>[FOTO]</span>
      </div>
      <div class="cart-item-info">
        <p class="cart-item-name">${item.product.name}</p>
        <p class="cart-item-unit">Preço unitário: R$ ${this.formatPrice(item.product.price)}</p>
      </div>
      <div class="qty-stepper">
        <button type="button" class="qty-btn qty-dec" aria-label="Diminuir">-</button>
        <span class="qty-value">${item.quantity}</span>
        <button type="button" class="qty-btn qty-inc" aria-label="Aumentar">+</button>
      </div>
      <p class="cart-item-total">R$ ${this.formatPrice(item.subtotal)}</p>
      <button type="button" class="cart-remove" aria-label="Remover item">
        <img src="assets/icons/x.svg" alt="" class="icon-18">
      </button>
    `;

    const id = item.product.id;
    this._bind(row.querySelector('.qty-dec'), 'click', () => this.viewModel.decreaseQty(id));
    this._bind(row.querySelector('.qty-inc'), 'click', () => this.viewModel.increaseQty(id));
    this._bind(row.querySelector('.cart-remove'), 'click', () => this.viewModel.removeItem(id));

    return row;
  }

  // Registra um listener e guarda a referência para remoção posterior
  _bind(el, type, fn) {
    el.addEventListener(type, fn);
    this._rowListeners.push({ el, type, fn });
  }

  // Remove todos os listeners das linhas antes de recriar o DOM
  _cleanupRowListeners() {
    this._rowListeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
    this._rowListeners = [];
  }

  // ---------- Resumo ----------
  renderSummary(state) {
    if (this.summaryCountEl) this.summaryCountEl.textContent = state.count;
    if (this.subtotalEl) this.subtotalEl.textContent = `R$ ${this.formatPrice(state.subtotal)}`;
    if (this.discountEl) this.discountEl.textContent = `- R$ ${this.formatPrice(state.discount)}`;
    if (this.totalEl) this.totalEl.textContent = `R$ ${this.formatPrice(state.total)}`;
  }

  renderCouponFeedback(state) {
    if (!this.couponFeedbackEl) return;
    if (state.couponError) {
      this.couponFeedbackEl.textContent = state.couponError;
      this.couponFeedbackEl.className = 'coupon-feedback error';
    } else if (state.couponCode) {
      this.couponFeedbackEl.textContent = `Cupom ${state.couponCode} aplicado.`;
      this.couponFeedbackEl.className = 'coupon-feedback success';
    } else {
      this.couponFeedbackEl.className = 'coupon-feedback hidden';
    }
  }

  renderPoints(state) {
    if (!this.pointsEl) return;
    this.pointsEl.textContent = `${state.points} pts`;
    this.redeemBtnEl.textContent = state.pointsRedeem ? 'Remover pontos' : 'Usar pontos';

    if (state.pointsError) {
      this.pointsFeedbackEl.textContent = state.pointsError;
      this.pointsFeedbackEl.className = 'coupon-feedback error';
    } else if (state.pointsRedeem) {
      const { points, value } = state.pointsRedeem;
      this.pointsFeedbackEl.textContent = `${points} pontos = R$ ${this.formatPrice(value)} de desconto aplicado.`;
      this.pointsFeedbackEl.className = 'coupon-feedback success';
    } else {
      this.pointsFeedbackEl.className = 'coupon-feedback hidden';
    }
  }

  renderCheckoutFeedback(state) {
    if (!this.checkoutFeedbackEl) return;
    if (state.feedback) {
      this.checkoutFeedbackEl.textContent = state.feedback.text;
      this.checkoutFeedbackEl.className = `feedback-message ${state.feedback.type}`;
    } else {
      this.checkoutFeedbackEl.className = 'feedback-message hidden';
    }
  }

  formatPrice(value) {
    return value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
