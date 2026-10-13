// js/viewmodels/catalogViewModel.js

class CatalogViewModel {
  constructor() {
    // Lista original intacta; a lista exibida é derivada dela por busca/categoria/ordenação
    this.allProducts = [];

    this.state = new Observable({
      isLoading: false,
      products: [],        // lista processada que a View desenha
      error: null,
      searchQuery: '',
      category: 'Todos',
      sortBy: 'relevance'
    });
  }

  async loadProducts() {
    this.state.value = { ...this.state.value, isLoading: true, error: null };

    try {
      const response = await ApiService.getProducts();
      if (response.ok) {
        this.allProducts = response.data.map(p => new Product(p));
        this._apply();
      } else {
        this.state.value = { ...this.state.value, isLoading: false, products: [], error: 'Erro ao carregar produtos.' };
      }
    } catch (err) {
      this.state.value = { ...this.state.value, isLoading: false, products: [], error: 'Falha de comunicação.' };
    }
  }

  // Comandos (a View apenas dispara; o cálculo do resultado fica aqui)
  setSearch(query) {
    this.state.value = { ...this.state.value, searchQuery: query };
    this._apply();
  }

  setCategory(category) {
    this.state.value = { ...this.state.value, category };
    this._apply();
  }

  setSort(sortBy) {
    this.state.value = { ...this.state.value, sortBy };
    this._apply();
  }

  // Recalcula a lista exibida a partir da busca + categoria + ordenação
  _apply() {
    const { searchQuery, category, sortBy } = this.state.value;
    const term = searchQuery.toLowerCase().trim();

    let list = this.allProducts.filter(p => {
      const matchTerm = !term || p.name.toLowerCase().includes(term);
      const matchCategory = category === 'Todos' || p.category === category;
      return matchTerm && matchCategory;
    });

    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    // 'relevance' mantém a ordem original

    this.state.value = { ...this.state.value, isLoading: false, products: list, error: null };
  }
}

const catalogViewModel = new CatalogViewModel();
