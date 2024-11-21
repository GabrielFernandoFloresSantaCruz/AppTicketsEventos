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
    // Verificar si 'data' está disponible antes de intentar acceder a sus propiedades
    if (this.data) {
      // Asegurarse de que la cantidad seleccionada no exceda la cantidad disponible
      if (this.selectedTickets > this.data.ticket_quantity) {
        alert("No hay suficientes boletos disponibles");
        return;
      }

      const ticketData = {
        eventId: this.id,
        eventName: this.data.name,
        ticketPrice: this.data.ticket_price,
        ticketQuantity: this.selectedTickets,
        totalPrice: this.selectedTickets * this.data.ticket_price
      };

      // Añadir los datos del ticket al carrito
      this.cartService.addToCart(ticketData);
    } else {
      alert("Error al cargar los datos del evento");
    }
  }
}