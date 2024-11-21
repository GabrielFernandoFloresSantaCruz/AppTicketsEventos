import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-view-event',
  standalone: true,
  imports: [CardComponent, NgFor],
  templateUrl: './view-event.component.html',
  styleUrl: './view-event.component.scss'
})
export class ViewEventComponent implements OnInit {

  id: any;
  data: any;
  constructor(
    public db: DatabaseService,
    public activatedRoute: ActivatedRoute
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('idEvent');
  }

  ngOnInit(): void {
    this.db.getDocumentById('eventos', this.id)
      .subscribe((res: any) => {
        console.log('perfil de usuario', res);
        this.data = res;
      });
  }

}
