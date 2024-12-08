import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {
events: any;
constructor(
  public db: DatabaseService,
){
  this.db.fetchFirestoreCollection('eventos')
  .subscribe((res:any)=>{
    console.log('Colección de Firebase', res);
    this.events = res;
  }),
  (error:any)=>{
    console.log('Error', error)
  }
}
}
