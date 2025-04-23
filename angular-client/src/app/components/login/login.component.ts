import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Admin } from '../../models/admin.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user: Admin = new Admin('', '', '',''); // כולל adminSecretCode
  currentUrl='https://localhost:7238/api'
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.http.post<any>(`${this.currentUrl}/auth/register`, this.user).subscribe({
      next: res => {
        this.authService.saveToken(res.token); 
        console.log(this.authService);
        // שמירה מקומית
        if (this.authService.isAdmin()) {
          alert('המשתמש נרשם כמנהל');
          // this.router.navigate(['']);
          this.router.navigate(['/users']);
        } else {
          alert('  אינך מנהל');
          this.authService.logout();
        }
      },
      error: err => {
        console.error(err);
        console.log(this.user);
        
        alert('שגיאה ברישום');
      }
    });
  }
}
