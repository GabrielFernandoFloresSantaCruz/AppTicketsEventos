import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-event',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.scss']
})
export class ViewEventComponent implements OnInit {

  id: any;
  data: any;
  selectedTickets: number = 1;

  constructor(
    public db: DatabaseService,
    public activatedRoute: ActivatedRoute,
    private cartService: CarritoService,
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('idEvent');
  }

  ngOnInit(): void {
    this.db.getDocumentById('eventos', this.id)
      .subscribe((res: any) => {
        this.data = res;
      });
  }

  addToCart(): void {
    if (this.data) {
      // Validar si la cantidad de boletos seleccionados excede la cantidad disponible
      if (this.selectedTickets > this.data.ticket_quantity) {
        alert("No hay suficientes boletos disponibles");
        return;
      }

      // Determinar el precio unitario (con descuento o sin descuento)
      const discountedPrice = this.data.discount
        ? this.data.ticket_price * (1 - this.data.percentage / 100)
        : this.data.ticket_price;

      // Crear el objeto con los datos necesarios para el carrito
      const ticketData = {
        eventId: this.id,
        eventName: this.data.name,
        ticketPrice: discountedPrice,
        originalPrice: this.data.ticket_price, // Guardar el precio original para mostrarlo en el carrito
        ticketQuantity: this.selectedTickets,
        totalPrice: discountedPrice * this.selectedTickets,
        discount: this.data.discount, // Indicar si el evento tiene descuento
        percentage: this.data.percentage // Guardar el porcentaje de descuento
      };

      // Agregar al carrito
      this.cartService.addToCart(ticketData);
    } else {
      alert("Error al cargar los datos del evento");
    }
  }
}