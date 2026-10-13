// js/views/catalogView.js

class CatalogView {
  constructor(viewModel) {
    this.viewModel = viewModel;
    this.gridEl = document.getElementById('catalog-grid');
    this.resultsTitleEl = document.getElementById('results-title');
    this.categoryListEl = document.getElementById('category-list');
    this.categoryChipsEl = document.getElementById('category-chips');      // layout mobile
    this.searchInputs = document.querySelectorAll('#search-input, #search-input-mobile');
  }

  init() {
    this.viewModel.state.subscribe(state => this.render(state));
  }

  render(state) {
    this.renderSearch(state);
    this.renderResultsTitle(state);
    this.renderCategories(state);
    this.renderGrid(state);
  }

  renderResultsTitle(state) {
    if (!this.resultsTitleEl) return;
    const alvo = state.searchQuery.trim() || state.category;
    this.resultsTitleEl.textContent = `Resultados de busca para "${alvo}"`;
  }

  // Mantém a busca do desktop e a do mobile com o mesmo texto
  renderSearch(state) {
    this.searchInputs.forEach(input => {
      if (input.value !== state.searchQuery) input.value = state.searchQuery;
    });
  }

  renderCategories(state) {
    [this.categoryListEl, this.categoryChipsEl].forEach(container => {
      if (!container) return;
      container.querySelectorAll('[data-category]').forEach(item => {
        item.classList.toggle('active', item.dataset.category === state.category);
      });
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
        ${product.inStock
          ? '<span class="only-desktop">Adicionar ao carrinho</span><span class="only-mobile">Adicionar</span>'
          : 'Esgotado'}
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
