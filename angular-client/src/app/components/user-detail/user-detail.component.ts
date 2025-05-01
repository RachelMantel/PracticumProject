import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDividerModule } from "@angular/material/divider"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import type { User } from "../../models/user.model"
import { ActivatedRoute, Router } from "@angular/router"
import { UsersService } from "../../services/users/users.service"

@Component({
  selector: "app-user-detail",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatProgressSpinnerModule],
  templateUrl: "./user-detail.component.html",
  styleUrl: "./user-detail.component.css",
})
export class UserDetailComponent implements OnInit {
  user: User | null = null
  loading = true

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
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
        },
      })
    }
  }

  goBack(): void {
    this.router.navigate(["/users"])
  }

  editUser(): void {
    if (this.user) {
      this.router.navigate(["/users", this.user.id, "edit"])
    }
  }

  viewSongs(): void {
    if (this.user) {
      this.router.navigate(["/users", this.user.id, "songs"])
    }
  }
}
