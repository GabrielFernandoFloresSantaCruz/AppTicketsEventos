import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CardComponent } from './components/card/card.component';
import { BtnComponent } from './components/btn/btn.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, CardComponent, BtnComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  isMenuOpen = true;

  constructor(private auth: AuthService, private router: Router) {
/*     localStorage.clear();
 */    console.log('AppComponent constructor ejecutado');
  }

  ngOnInit(): void {
/*     localStorage.clear();
 */  
    /* if (!this.auth.isLogued) {
      console.log('No hay sesión activa. Redirigiendo al login...');
      this.router.navigateByUrl('/log-in');
    } else {
      console.log('Sesión activa:', this.auth.profile);
    } */
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}