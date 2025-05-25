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
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
  })
  export class SidebarComponent {
    constructor(private router: Router) {}
  
    isLoggedIn(): boolean {
      return !!localStorage.getItem('authToken');
    }
  
    logout(): void {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      this.router.navigate(['/home']);
    }
  
    goToLogin(): void {
      this.router.navigate(['/login']);
    }
  }
  