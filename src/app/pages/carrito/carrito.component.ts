import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, CartItemComponent, CurrencyPipe], // Se asegura de incluir CurrencyPipe
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss',
})
export class CarritoComponent implements OnInit {
  title: string = 'Carrito de Compras';
  cartData: any[] = [];
  totalTickets: number = 0;
  totalPrice: number = 0;

  constructor(public cartService: CarritoService) {}

  ngOnInit(): void {
    this.loadCartData();
  }

  loadCartData(): void {
    this.cartData = this.cartService.getCartItems();
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.totalTickets = this.cartData.reduce((sum, item) => sum + item.ticketQuantity, 0);
    this.totalPrice = this.cartData.reduce((sum, item) => sum + item.totalPrice, 0); // Usa `totalPrice` directamente
  }

  hasDiscount(): boolean {
    return this.cartData.some(item => item.discount);
  }

  removeItem(item: any): void {
    this.cartService.removeItem(item);
    this.loadCartData(); // Recarga el carrito y recalcula los totales
  }

  saveTotal(): void {
    localStorage.setItem('totalPrice', JSON.stringify(this.totalPrice));
  }
}