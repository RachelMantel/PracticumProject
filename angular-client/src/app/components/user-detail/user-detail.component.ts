import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDividerModule } from "@angular/material/divider"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import type { User } from "../../models/user.model"
import { ActivatedRoute, Router } from "@angular/router"
import { UsersService } from "../../services/users/users.service"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: "app-user-detail",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./user-detail.component.html",
  styleUrls: ["./user-detail.component.css"],
})
export class UserDetailComponent implements OnInit {
  user: User | null = null
  editedUser: User | null = null
  loading = true
  isEditing = false
  hidePassword = true

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadUser()
  }

  loadUser(): void {
    const userId = Number(this.route.snapshot.paramMap.get("id"))
    if (userId) {
      this.usersService.getUserById(userId).subscribe({
        next: (user) => {
          this.user = user
          this.loading = false
        },
        error: (error) => {
          console.error("Error fetching user:", error)
          this.loading = false
          this.snackBar.open("Error loading user data", "Close", { duration: 3000 })
        },
      })
    }
  }

  goBack(): void {
    this.router.navigate(["/users"])
  }

  startEdit(): void {
    if (this.user) {
      this.editedUser = { ...this.user }
      this.isEditing = true
    }
  }

  cancelEdit(): void {
    this.isEditing = false
    this.editedUser = null
  }

  saveUser(): void {
    if (!this.editedUser || !this.user?.id) return

    this.loading = true

    this.usersService.updateUser(this.user.id, this.editedUser).subscribe({
      next: () => {
        this.loading = false
        this.isEditing = false
        this.snackBar.open("User updated successfully", "Close", { duration: 3000 })
        this.loadUser() // Reload user data
      },
      error: (error) => {
        console.error("Error updating user:", error)
        this.loading = false
        this.snackBar.open("Error updating user", "Close", { duration: 3000 })
      },
    })
  }

  deleteUser(): void {
    if (!this.user?.id) return

    if (confirm("Are you sure you want to delete this user?")) {
      this.loading = true

      this.usersService.deleteUser(this.user.id).subscribe({
        next: () => {
          this.loading = false
          this.snackBar.open("User deleted successfully", "Close", { duration: 3000 })
          this.router.navigate(["/users"])
        },
        error: (error) => {
          console.error("Error deleting user:", error)
          this.loading = false
          this.snackBar.open("Error deleting user", "Close", { duration: 3000 })
        },
      })
    }
  }

  viewSongs(): void {
    if (this.user) {
      this.router.navigate(["/users", this.user.id, "songs"])
    }
  }
}
