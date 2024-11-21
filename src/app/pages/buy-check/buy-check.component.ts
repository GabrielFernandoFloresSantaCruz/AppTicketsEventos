import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';
import { RouterLink } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-buy-check',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './buy-check.component.html',
  styleUrl: './buy-check.component.scss',
})
export class BuyCheckComponent implements OnInit, OnDestroy {
  paymentForm: FormGroup;
  cartData: any[] = [];
  totalPrice: number = 0;

  constructor(
    private fb: FormBuilder,
    private cartService: CarritoService,
    private db: DatabaseService,
    private authService: AuthService
  ) {
    this.paymentForm = this.fb.group({
      cardName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expirationDate: [
        '',
        [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
      ],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  ngOnInit(): void {
    // Cargar datos del carrito y calcular el total
    this.cartData = this.cartService.getCartItems();
    this.totalPrice = this.cartData.reduce((sum, item) => sum + item.totalPrice, 0);
    console.log('Contenido de cartItems:', this.cartData);
  }

  ngOnDestroy(): void {
    console.log('Payment confirmation component destroyed');
  }

  async onPaymentSubmit(): Promise<void> {
    if (this.paymentForm.valid) {
      // Verificar si el usuario está logueado
      if (!this.authService.isLogued || !this.authService.profile) {
        alert('Debes iniciar sesión para completar la compra.');
        return;
      }

      const userId = this.authService.profile.uid;

      try {
        // Procesar cada ítem del carrito como una compra individual
        for (const item of this.cartData) {
          if (!item.eventName || !item.ticketQuantity || item.totalPrice === undefined) {
            console.error('Datos inválidos para el ítem:', item);
            alert('Error: uno o más productos en el carrito tienen datos incompletos.');
            return;
          }

          const purchaseData = {
            userId,
            eventId: item.eventId,
            eventName: item.eventName,
            ticketQuantity: item.ticketQuantity,
            totalPrice: item.totalPrice,
          };

          console.log('Guardando en Firestore:', purchaseData);
          await this.db.addFirestoreDocument('purchases', purchaseData);
        }

        // Confirmación de éxito
        alert('Pago confirmado con éxito. Detalles guardados en el historial.');

        // Limpiar el carrito y el localStorage
        this.cartService.clearCart();
        localStorage.removeItem('cart');
        localStorage.removeItem('totalPrice');
      } catch (error) {
        console.error('Error al guardar en historial:', error);
        alert('Hubo un problema al procesar el pago. Inténtalo de nuevo.');
      }
    } else {
      alert('Por favor revise los datos ingresados');
    }
  }
}