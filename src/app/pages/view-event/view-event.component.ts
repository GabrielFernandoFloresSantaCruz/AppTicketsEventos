import { Component, input, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { NgFor } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-event',
  standalone: true,
  imports: [CardComponent, NgFor, FormsModule],
  templateUrl: './view-event.component.html',
  styleUrl: './view-event.component.scss'
})
export class ViewEventComponent implements OnInit {

  id: any;
  data: any;
  selectedTickets: number = 1;
  value = input<number>(0)
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
    const ticketData = {
      eventId: this.id,
      eventName: this.data.name,
      ticketPrice: this.data.ticket_price,
      ticketQuantity: this.selectedTickets,
      totalPrice: this.selectedTickets * this.data.ticket_price
    };

    this.cartService.addToCart(ticketData);
  }
}
