// js/views/catalogView.js

class CatalogView {
  constructor(viewModel) {
    this.viewModel = viewModel;
    this.gridEl = document.getElementById('catalog-grid');
    this.resultsTitleEl = document.getElementById('results-title');
    this.categoryListEl = document.getElementById('category-list');
  }

  init() {
    this.viewModel.state.subscribe(state => this.render(state));
  }

  render(state) {
    this.renderResultsTitle(state);
    this.renderCategories(state);
    this.renderGrid(state);
  }

  renderResultsTitle(state) {
    if (!this.resultsTitleEl) return;
    const alvo = state.searchQuery.trim() || state.category;
    this.resultsTitleEl.textContent = `Resultados de busca para "${alvo}"`;
  }

  renderCategories(state) {
    if (!this.categoryListEl) return;
    this.categoryListEl.querySelectorAll('.category-item').forEach(item => {
      const isActive = item.dataset.category === state.category;
      item.classList.toggle('active', isActive);
    });
  }

  renderGrid(state) {
    if (state.isLoading) {
      this.gridEl.innerHTML = '<p class="grid-message">Carregando produtos...</p>';
      return;
    }

    if (state.error) {
      this.gridEl.innerHTML = `<p class="grid-message error">${state.error}</p>`;
      return;
    }

    if (state.products.length === 0) {
      this.gridEl.innerHTML = '<p class="grid-message">Nenhum produto encontrado.</p>';
      return;
    }

    this.gridEl.innerHTML = '';
    state.products.forEach(product => {
      this.gridEl.appendChild(this.createCard(product));
    });
  }

  createCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <div class="product-image">
        <img src="assets/icons/image.svg" alt="" class="icon-24">
        <span>[FOTO DO PRODUTO]</span>
      </div>
      <div class="product-body">
        <h3 class="product-name" title="${product.name}">${product.name}</h3>
        <p class="product-price">R$ ${this.formatPrice(product.price)}</p>
        <div class="product-rating">
          <span class="stars">${this.buildStars(product.rating)}</span>
          <span class="rating-value">(${product.rating.toFixed(1)})</span>
        </div>
      </div>
      <button class="btn-add-cart" data-id="${product.id}" ${product.inStock ? '' : 'disabled'}>
        <img src="assets/icons/plus.svg" alt="" class="icon-16">
        ${product.inStock ? 'Adicionar ao carrinho' : 'Esgotado'}
      </button>
    `;

    return card;
  }

  buildStars(rating) {
    const filled = Math.round(rating);
    let html = '';
    for (let i = 0; i < 5; i++) {
      const src = i < filled ? 'assets/icons/star-filled.svg' : 'assets/icons/star-empty.svg';
      html += `<img src="${src}" alt="" class="icon-star">`;
    }
    return html;
  }

  formatPrice(value) {
    return value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
