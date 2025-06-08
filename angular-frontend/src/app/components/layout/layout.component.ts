import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container>
      <mat-sidenav mode="side" opened>
        <mat-toolbar>
          <span>Menu</span>
        </mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/clients">
            <mat-icon>people</mat-icon>
            <span>Clients</span>
          </a>
          <a mat-list-item routerLink="/products">
            <mat-icon>inventory</mat-icon>
            <span>Products</span>
          </a>
          <a mat-list-item routerLink="/invoices">
            <mat-icon>receipt</mat-icon>
            <span>Invoices</span>
          </a>
          <a mat-list-item routerLink="/payments">
            <mat-icon>payment</mat-icon>
            <span>Payments</span>
          </a>
          <ng-container *ngIf="isAdmin$ | async">
            <a mat-list-item routerLink="/settings">
              <mat-icon>settings</mat-icon>
              <span>Settings</span>
            </a>
          </ng-container>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span>Business Management System</span>
          <span class="toolbar-spacer"></span>
          <button mat-icon-button (click)="logout()">
            <mat-icon>logout</mat-icon>
          </button>
        </mat-toolbar>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    mat-sidenav-container {
      height: 100vh;
    }

    mat-sidenav {
      width: 250px;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .content {
      padding: 20px;
    }

    mat-nav-list a {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  `]
})
export class LayoutComponent {
  isAdmin$ = this.authService.currentUser$.pipe(
    map(user => user?.roles?.includes('ADMIN') || false)
  );

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}