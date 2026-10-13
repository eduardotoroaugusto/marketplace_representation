// js/models/cartItem.js
class CartItem {
  constructor(product, quantity = 1) {
    this.product = product;
    this.quantity = quantity;
  }

  get subtotal() {
    return this.product.price * this.quantity;
  }
}