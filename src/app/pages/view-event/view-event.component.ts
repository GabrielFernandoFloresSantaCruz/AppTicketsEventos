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
    if (!this.selectedTickets || this.selectedTickets < 1 || this.selectedTickets > this.data?.ticket_quantity) {
      alert('Cantidad de boletos no válida.');
      return;
    }
  
    const cartItem = {
      eventId: this.data.id,
      eventName: this.data.name,
      ticketPrice: this.data.ticket_price, 
      ticketQuantity: this.selectedTickets,
      totalPrice: this.data.ticket_price * this.selectedTickets,
      discount: this.data.discount,
      percentage: this.data.percentage || 0,
      originalPrice: this.data.ticket_price
    };
  
    this.cartService.addToCart(cartItem);
    alert('Boletos añadidos al carrito.');
  }
}