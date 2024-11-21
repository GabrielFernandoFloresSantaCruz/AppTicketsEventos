import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-buy-check',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './buy-check.component.html',
  styleUrl: './buy-check.component.scss',
})
export class BuyCheckComponent implements OnDestroy {
  paymentForm: FormGroup;

  constructor(private fb: FormBuilder, private cartService: CarritoService) {
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

  ngOnDestroy(): void {
    console.log('Payment confirmation component destroyed');
  }

  onPaymentSubmit(): void {
    if (this.paymentForm.valid) {
      alert('Pago confirmado con éxito');
      
      localStorage.removeItem('cart');
      localStorage.removeItem('totalPrice');
      
      this.cartService.clearCart();
    } else {
      alert('Por favor revise los datos ingresados');
    }
  }
}