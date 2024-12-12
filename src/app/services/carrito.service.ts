import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private cartKey = 'cartItems';
  private cart: any[] = [];

  constructor() {
    this.loadCartFromLocalStorage();
  }

  addToCart(item: any): void {
    const discountedPrice = item.discount
      ? item.ticketPrice - (item.ticketPrice * item.percentage) / 100
      : item.ticketPrice;

    const ticketData = {
      ...item,
      originalPrice: item.ticketPrice,
      ticketPrice: discountedPrice,
      totalPrice: discountedPrice * item.ticketQuantity, // Correcto cálculo del subtotal
    };

    this.cart.push(ticketData);
    this.updateLocalStorage();
  }

  getCartItems(): any[] {
    return this.cart; // Devuelve directamente los ítems sin recalcular
  }

  clearCart(): void {
    this.cart = [];
    this.updateLocalStorage();
  }

  removeItem(item: any): void {
    this.cart = this.cart.filter((cartItem) => cartItem.eventId !== item.eventId); // Se usa `eventId` para evitar eliminar incorrectamente elementos iguales
    this.updateLocalStorage();
  }

  private updateLocalStorage(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
  }

  private loadCartFromLocalStorage(): void {
    const storedCart = localStorage.getItem(this.cartKey);
    this.cart = storedCart ? JSON.parse(storedCart) : [];
  }
}