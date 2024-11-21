import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-buy-check',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './buy-check.component.html',
  styleUrl: './buy-check.component.scss'
})

export class BuyCheckComponent implements OnDestroy {

  paymentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      cardName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expirationDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  ngOnDestroy(): void {
    console.log('Payment confirmation component destroyed');
  }

  onPaymentSubmit() {
    if (this.paymentForm.valid) {
      console.log('Información de pago:', this.paymentForm.value);
      alert('Pago confirmado con éxito');
    } else {
      console.log('Formulario inválido:', this.paymentForm);
      alert('Por favor revise los datos ingresados.');
    }
  }
}
