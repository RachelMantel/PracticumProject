import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { User } from "../../models/user.model"
import { ActivatedRoute, Router } from "@angular/router"
import { UsersService } from "../../services/users/users.service"

@Component({
  selector: "app-edit-user",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./edit-user.component.html",
  styleUrl: "./edit-user.component.css",
})
export class EditUserComponent implements OnInit {
  user: User = new User("","","",new Date(),0)
  userId = 0
  loading = true
  hidePassword = true

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get("id"))
    if (this.userId) {
      this.usersService.getUserById(this.userId).subscribe({
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

  saveUser(): void {
    this.loading = true
    this.usersService.updateUser(this.userId, this.user)
    this.router.navigate(["/users", this.userId])
  }

  cancel(): void {
    this.router.navigate(["/users", this.userId])
  }
}
