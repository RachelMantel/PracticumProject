import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="sidebar-header">
      <div class="logo-container">
        <mat-icon class="logo-icon">headphones</mat-icon>
        <span class="logo-text">Tune Your Mood</span>
      </div>
    </div>

    <mat-divider></mat-divider>

    <mat-nav-list>
      <a mat-list-item routerLink="/home" routerLinkActive="active-link">
        <mat-icon>home</mat-icon>
        <span>Home</span>
      </a>

      @if(isLoggedIn()){
      <ng-container>
        <a mat-list-item routerLink="/users" routerLinkActive="active-link">
          <mat-icon>people</mat-icon>
          <span>Users</span>
        </a>
        <a mat-list-item routerLink="/songs" routerLinkActive="active-link">
          <mat-icon>music_note</mat-icon>
          <span>Songs</span>
        </a>

        <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
          <mat-icon>dashboard</mat-icon>
          <span>Dashboard</span>
        </a>
      </ng-container>
      }
    </mat-nav-list>

    <div class="sidebar-footer">
      <mat-divider></mat-divider>

      @if(isLoggedIn()){
      <ng-container>
        <button class="action-button" (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Logout</span>
        </button>
      </ng-container>
      }
      <ng-template #loginButton>
        <button class="action-button" (click)="goToLogin()">
          <mat-icon>login</mat-icon>
          <span>Login</span>
        </button>
      </ng-template>
    </div>

    <ng-template #loginLink></ng-template>
  `,
  styles: [`
    .sidebar-header {
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-icon {
      background: linear-gradient(90deg, #E91E63, #FF5722);
      color: white;
      border-radius: 50%;
      padding: 8px;
      font-size: 24px;
      height: 40px;
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-text {
      font-size: 16px;
      font-weight: 600;
      background: linear-gradient(90deg, #E91E63, #FF5722);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    mat-nav-list {
      padding-top: 16px;
    }

    mat-nav-list a {
      margin-bottom: 8px;
      border-radius: 0 24px 24px 0;
      margin-right: 16px;
    }

    mat-nav-list a mat-icon {
      margin-right: 16px;
    }

    .active-link {
      background: linear-gradient(90deg, rgba(233,30,99,0.1), rgba(255,87,34,0.1));
      border-left: 4px solid #E91E63;
    }

    .sidebar-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 12px 16px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
    }

    .action-button {
      background-color: transparent;
      border: 2px solid #E91E63;
      color: #E91E63;
      padding: 8px 16px;
      border-radius: 24px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
    }

    .action-button:hover {
      background-color: #E91E63;
      color: white;
    }

    .action-button mat-icon {
      font-size: 20px;
    }
  `]
})
export class SidebarComponent {
  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/home']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
