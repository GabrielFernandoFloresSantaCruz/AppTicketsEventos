import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  purchases: any[] = [];

  constructor(public auth: AuthService, public db: DatabaseService) {}

  ngOnInit(): void {
    if (this.auth.isLogued && this.auth.profile?.id) {
      this.db
        .getDocumentsByField('purchases', 'userId', this.auth.profile.id)
        .subscribe((data) => {
          this.purchases = data;
        });
    }
  }
}