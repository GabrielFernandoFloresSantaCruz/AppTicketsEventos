import { Component, importProvidersFrom, OnDestroy } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { BtnComponent } from '../../components/btn/btn.component';
/////// paso 1 importar servicio
import { AuthService } from '../../services/auth.service';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DatabaseService } from '../../services/database.service';
import { CoreModule } from '../../core.module';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [// HttpClientModule debe estar aquí
    RouterLink,
    NgFor,
    CardComponent,
    BtnComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  title: string = 'Home';
  events: any[] = [];
  filteredEvents: any[] = [];

  constructor(
    public http: HttpClient,
    public db: DatabaseService,
    public auth: AuthService
  ) {
    this.loadData();
  }

  loadData() {
    this.db.fetchFirestoreCollection('eventos')
      .subscribe((res: any[]) => {
        this.events = res;
        this.filteredEvents = res;
      });
  }

  filterByTag(tag: string) {
    if (tag === '') {
      this.filteredEvents = this.events;
    } else if (tag === 'destacados') {
      this.filteredEvents = this.events.filter(event => event.discount === true);
    } else {
      this.filteredEvents = this.events.filter(event =>
        event.tags && event.tags.includes(tag)
      );
    }
  }
}