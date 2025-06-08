import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, Routes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LoginComponent } from './app/login/login.component';
import { RegisterComponent } from './app/register/register.component';
import { HomeComponent } from './app/home/home.component';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { AuthGuard } from './app/guards/auth.guard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class App {
  constructor() {}
}

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard] // Seulement pour les admins
  },
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [AuthGuard] // Pour tous les utilisateurs authentifiés
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    AuthGuard
  ]
}).catch(err => console.error(err));