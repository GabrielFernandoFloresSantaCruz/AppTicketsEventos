import { Component } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [NgFor, RouterLink, CartItemComponent],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent {
  title: string = 'Carrito de Compras';
  cartData: any[] = [];
  totalTickets: number = 0;
  totalPrice: number = 0;

  constructor(public cartService: CarritoService) {}

  ngOnInit(): void {
    this.cartData = this.cartService.getCartItems();
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.totalTickets = this.cartData.reduce((sum, item) => sum + item.ticketQuantity, 0);
    this.totalPrice = this.cartData.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  removeItem(item: any): void {
    this.cartService.removeItem(item);
    this.cartData = this.cartService.getCartItems();
    this.calculateTotals();
  }
  saveTotal(): void {
    localStorage.setItem('totalPrice', JSON.stringify(this.totalPrice));
  }
}