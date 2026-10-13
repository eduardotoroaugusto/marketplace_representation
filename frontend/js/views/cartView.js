// js/views/cartView.js

class CartView {
  constructor(viewModel) {
    this.viewModel = viewModel;
    this.countEl = document.getElementById('cart-count');
  }

  init() {
    this.viewModel.state.subscribe(state => this.render(state));
  }

  render(state) {
    // Total de itens (soma das quantidades) exibido no badge do carrinho
    const totalItens = state.items.reduce((sum, item) => sum + item.quantity, 0);
    if (this.countEl) this.countEl.textContent = totalItens;
  }
}
