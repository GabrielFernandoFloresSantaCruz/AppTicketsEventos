import { Component, Input } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  @Input() data: any;

  constructor(private cartService: CarritoService) {}

  removeItem(): void {
    this.cartService.removeItem(this.data);
  }
}