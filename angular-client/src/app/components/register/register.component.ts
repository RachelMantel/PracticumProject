import { Component } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatDividerModule } from "@angular/material/divider"
import type { User } from "../../models/user.model"
import { HttpClient } from "@angular/common/http"
import { Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Admin } from "../../models/admin.model"
import { AuthService } from "../../services/auth/auth.service"

@Component({
  selector: "app-register",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatDividerModule,
  ],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {
 user: Admin = new Admin("", "", "")
  confirmPassword = ""
  hidePassword = true
  hideConfirmPassword = true
  isLoading = false
  currentUrl = "https://tuneyourmood-server.onrender.com/api"

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,

  ) {}

  register() {
    if (!this.user.name||!this.user.email || !this.user.adminSecretCode || !this.user.password) {
      this.snackBar.open("Please fill in all required fields", "Close", { duration: 3000 })
      return
    }


    this.isLoading = true
    this.http.post<any>(`${this.currentUrl}/Auth/register`, this.user).subscribe({
      next: (res) => {

          this.authService.saveToken(res.token)
          this.isLoading = false
  
          if (this.authService.isAdmin()) {
            this.snackBar.open("registered successfully as admin", "Close", { duration: 3000 })
            this.router.navigate(["/home"])
          } else {
            this.snackBar.open("You are not an admin", "Close", { duration: 3000 })
            this.authService.logout()

        this.isLoading = false
        this.snackBar.open("Registration successful! ", "Close", { duration: 3000 })
        this.router.navigate(["/home"])
          }
      },
      error: (err) => {
        console.error(err)
        this.isLoading = false
        this.snackBar.open("Registration failed. Please try again.", "Close", { duration: 3000 })
      },
    })
  }

  navigateToLogin() {
    this.router.navigate(["/login"])
  }
}
