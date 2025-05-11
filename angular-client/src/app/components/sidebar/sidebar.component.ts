import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
        <span class="logo-text">AI Music</span>
      </div>
    </div>
    <mat-divider></mat-divider>
    <mat-nav-list>
      <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
        <mat-icon>dashboard</mat-icon>
        <span>Dashboard</span>
      </a>
      <a mat-list-item routerLink="/users" routerLinkActive="active-link">
        <mat-icon>people</mat-icon>
        <span>Users</span>
      </a>
      <a mat-list-item routerLink="/songs" routerLinkActive="active-link">
        <mat-icon>music_note</mat-icon>
        <span>Songs</span>
      </a>
      <a mat-list-item routerLink="/analytics" routerLinkActive="active-link">
        <mat-icon>bar_chart</mat-icon>
        <span>Analytics</span>
      </a>
      <a mat-list-item routerLink="/settings" routerLinkActive="active-link">
        <mat-icon>settings</mat-icon>
        <span>Settings</span>
      </a>
    </mat-nav-list>
    <div class="sidebar-footer">
      <mat-divider></mat-divider>
      <a mat-list-item routerLink="/login">
        <mat-icon>exit_to_app</mat-icon>
        <span>Logout</span>
      </a>
    </div>
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
      gap: 10px;
    }
    
    .logo-icon {
      background: linear-gradient(90deg, #E91E63 0%, #FF5722 100%);
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
      font-size: 20px;
      font-weight: 600;
      background: linear-gradient(90deg, #E91E63 0%, #FF5722 100%);
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
      background: linear-gradient(90deg, rgba(233, 30, 99, 0.1) 0%, rgba(255, 87, 34, 0.1) 100%);
      border-left: 4px solid #E91E63;
    }
    
    .sidebar-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
    }
  `]
})
export class SidebarComponent {}
