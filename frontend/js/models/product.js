// js/models/product.js
class Product {
  constructor({ id, name, price, stock, category, rating }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.category = category;
    this.rating = rating;
  }

  get inStock() {
    return this.stock > 0;
  }
}
