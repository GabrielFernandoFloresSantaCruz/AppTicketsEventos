import { Routes } from '@angular/router';
import { BuyCheckComponent } from './pages/buy-check/buy-check.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { LogInComponent } from './pages/log-in/log-in.component';
import { ViewEventComponent } from './pages/view-event/view-event.component';

export const routes: Routes = [
    { path: 'buy-check', component: BuyCheckComponent},
    { path: 'carrito', component: CarritoComponent},
    { path: 'historial', component: HistorialComponent},
    { path: 'home', component: HomeComponent},
    { path: 'log-in', component: LogInComponent},
    { path: 'profile', component: ProfileComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'view-event/:idEvent', component: ViewEventComponent},
];
