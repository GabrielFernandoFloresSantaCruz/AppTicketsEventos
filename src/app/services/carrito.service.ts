import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private cartKey = 'cartItems';
  private cart: any[] = [];

  constructor() {
    this.loadCartFromLocalStorage();
  }

  addToCart(item: any): void {
    this.cart.push(item);
    this.updateLocalStorage();
  }

  getCartItems(): any[] {
    return this.cart;
  }

  clearCart(): void {
    this.cart = [];
    this.updateLocalStorage();
  }

  removeItem(item: any): void {
    this.cart = this.cart.filter((cartItem) => cartItem !== item);
    this.updateLocalStorage();
    location.reload();
  }

  private updateLocalStorage(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
  }

  private loadCartFromLocalStorage(): void {
    const storedCart = localStorage.getItem(this.cartKey);
    this.cart = storedCart ? JSON.parse(storedCart) : [];
  }
}