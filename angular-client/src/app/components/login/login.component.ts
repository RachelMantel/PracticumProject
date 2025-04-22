import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Admin } from '../../models/user.model';
import { log } from 'console';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user: Admin = new Admin('', '', ''); // כולל adminSecretCode

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.http.post<any>('https://localhost:5001/api/auth/register', this.user).subscribe({
      next: res => {
        this.authService.saveToken(res.token); // שמירה מקומית
        if (this.authService.isAdmin()) {
          alert('המשתמש נרשם כמנהל');
          this.router.navigate(['/admin']);
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
