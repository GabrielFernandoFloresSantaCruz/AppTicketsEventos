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
  styleUrls: ['./buy-check.component.scss'],
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
    console.log('Contenido del carrito:', this.cartData);
  }

  ngOnDestroy(): void {
    console.log('Componente BuyCheck destruido.');
  }

  async onPaymentSubmit(): Promise<void> {
    console.log('Iniciando proceso de pago...');

    if (!this.paymentForm.valid) {
      alert('Por favor, revise los datos del formulario.');
      return;
    }
    console.log('Formulario válido.');

    // Verificar si el usuario está logueado
    if (!this.authService.isLogued || !this.authService.profile) {
      alert('Debes iniciar sesión para completar la compra.');
      return;
    }

    const userId = this.authService.profile.uid;

    try {
      for (const item of this.cartData) {
        console.log('Procesando ítem del carrito:', item);

        if (!item.eventId || !item.ticketQuantity || item.totalPrice === undefined) {
          console.error('Datos inválidos para el ítem:', item);
          alert('Error: uno o más productos tienen datos incompletos.');
          return;
        }

        console.log('Obteniendo datos del evento con ID:', item.eventId);

        // Paso 1: Obtener datos del evento desde Firestore
        const eventData: any = await this.db.getDocumentByIdAsPromise('eventos', item.eventId);
        console.log('Datos del evento obtenidos:', eventData);

        if (!eventData || eventData.ticket_quantity === undefined) {
          console.error('Evento no encontrado o sin información de boletos disponibles:', item.eventId);
          alert(`Error: el evento "${item.eventName}" no tiene información válida.`);
          return;
        }

        // Paso 2: Verificar disponibilidad de boletos
        const remainingTickets = eventData.ticket_quantity - item.ticketQuantity;
        if (remainingTickets < 0) {
          console.error('No hay suficientes boletos disponibles:', eventData.ticket_quantity);
          alert(`Error: No hay suficientes boletos para "${item.eventName}".`);
          return;
        }
        console.log(`Boletos restantes calculados: ${remainingTickets}`);

        // Paso 3: Actualizar boletos disponibles en Firestore
        console.log(`Actualizando boletos disponibles para el evento: ${eventData.name}`);
        await this.db.updateFirestoreDocument('eventos', item.eventId, { ticket_quantity: remainingTickets });
        console.log(`Boletos actualizados correctamente para el evento: ${eventData.name}`);

        // Paso 4: Registrar la compra en Firestore
        const purchaseData = {
          userId,
          eventId: item.eventId,
          eventName: item.eventName,
          ticketQuantity: item.ticketQuantity,
          totalPrice: item.totalPrice,
        };
        console.log('Guardando compra en Firestore:', purchaseData);
        await this.db.addFirestoreDocument('purchases', purchaseData);
        console.log('Compra registrada correctamente en Firestore.');
      }

      // Confirmación de éxito
      alert('Pago confirmado con éxito. Detalles guardados en el historial.');

      // Limpiar el carrito y el localStorage
      this.cartService.clearCart();
      localStorage.removeItem('cart');
      localStorage.removeItem('totalPrice');
    } catch (error) {
      console.error('Error durante el proceso de pago:', error);
      alert('Hubo un problema al procesar el pago. Inténtalo de nuevo.');
    }
  }
}
