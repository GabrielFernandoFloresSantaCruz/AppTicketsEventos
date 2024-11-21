import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private cart: any[] = [];

  constructor() { }

  addToCart(item: any): void {
    this.cart.push(item);
  }

  getCartItems(): any[] {
    return this.cart;
  }

  clearCart(): void {
    this.cart = [];
  }
}
