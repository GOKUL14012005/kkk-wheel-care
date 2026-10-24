import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ProductsComponent } from './pages/products/products';
import { RegisterComponent } from './pages/register/register';
import { LoginComponent } from './pages/login/login';
import { ProfileComponent } from './pages/profile/profile';
import { BookingsComponent } from './pages/bookings/bookings';
import { NotFoundComponent } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'KKK Wheel Care - Home' },
  { path: 'products', component: ProductsComponent, title: 'KKK Wheel Care - Products & Tyres' },
  { path: 'register', component: RegisterComponent, title: 'KKK Wheel Care - Customer Registration' },
  { path: 'login', component: LoginComponent, title: 'KKK Wheel Care - Login' },
  { path: 'profile', component: ProfileComponent, title: 'KKK Wheel Care - Customer Garage' },
  { path: 'bookings', component: BookingsComponent, title: 'KKK Wheel Care - Service Booking' },
  { path: '**', component: NotFoundComponent, title: 'KKK Wheel Care - Page Not Found' }
];
