import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  purchases: any[] = [];

  constructor(
    public auth: AuthService,
    public db: DatabaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPurchases();
  }

  private loadPurchases(): void {
    if (!this.auth.isLogued || !this.auth.profile?.id) {
      alert('Debes iniciar sesión para ver tu perfil.');
      this.router.navigate(['/login']);
    } else {
      this.db
        .getDocumentsByField('purchases', 'userId', this.auth.profile.id)
        .subscribe((data) => {
          this.purchases = data.map((purchase: any) => {
            const discountMultiplier = purchase.discount
              ? 1 - purchase.percentage / 100
              : 1;
            const unitPrice = purchase.originalPrice * discountMultiplier;
  
            return {
              eventName: purchase.eventName,
              ticketQuantity: purchase.ticketQuantity,
              originalPrice: purchase.originalPrice,
              discount: purchase.discount || false,
              percentage: purchase.percentage || 0,
              unitPrice,
              originalTotalPrice: purchase.ticketQuantity * purchase.originalPrice,
              totalPrice: purchase.totalPrice || unitPrice * purchase.ticketQuantity,
            };
          });
        });
    }
  }
}