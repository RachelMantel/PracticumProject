import { Component, PLATFORM_ID, Inject } from "@angular/core"
import { isPlatformBrowser } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatDividerModule } from "@angular/material/divider"
import { Admin } from "../../models/admin.model"
import { HttpClient } from "@angular/common/http"
import { AuthService } from "../../services/auth/auth.service"
import { Router } from "@angular/router"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"

@Component({
  selector: "app-login",
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
    MatSnackBarModule,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  user: Admin = new Admin("", "", "")
  hidePassword = true
  isLoading = false
  currentUrl = "https://tuneyourmood-server.onrender.com/api"
  private isBrowser: boolean

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId)
  }

  login() {
    if (!this.user.UserNameOrEmail || !this.user.password) {
      this.snackBar.open("Please fill in all required fields", "Close", { duration: 3000 })
      return
    }

    this.isLoading = true
    this.http.post<any>(`${this.currentUrl}/Auth/login`, this.user).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token)
        this.isLoading = false

        if (this.authService.isAdmin()) {
          this.snackBar.open("Logged in successfully as admin", "Close", { duration: 3000 })
          this.router.navigate(["/users"])
        } else {
          this.snackBar.open("You are not an admin", "Close", { duration: 3000 })
          this.authService.logout()
        }
      },
      error: (err) => {
        console.error(err)
        this.isLoading = false
        this.snackBar.open("Login failed. Please check your credentials.", "Close", { duration: 3000 })
      },
    })
  }

  navigateToRegister() {
    this.router.navigate(["/register"])
  }
}
