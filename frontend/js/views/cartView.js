// js/views/cartView.js

class CartView {
  constructor(viewModel) {
    this.viewModel = viewModel;
    // Badge da top-nav (desktop) e do cabeçalho mobile
    this.countEls = document.querySelectorAll('#cart-count, [data-cart-count]');
  }

  init() {
    this.viewModel.state.subscribe(state => this.render(state));
  }

  render(state) {
    // Total de itens (soma das quantidades) exibido no badge do carrinho
    const totalItens = state.items.reduce((sum, item) => sum + item.quantity, 0);
    this.countEls.forEach(el => { el.textContent = totalItens; });
  }
}
