import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatDividerModule } from "@angular/material/divider"
import { UsersService } from "../../services/users/users.service"
import { Router } from "@angular/router"

@Component({
  selector: "app-users",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDividerModule],
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.css",
})
export class UsersComponent implements OnInit {
  users$ = this.usersService.users

  constructor(
    private usersService: UsersService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.usersService.getUsers()
  }

  viewUserDetails(userId: number): void {
    this.router.navigate(["/users", userId])
  }

  editUser(userId: number, event: Event): void {
    event.stopPropagation() // Prevent the card click event
    this.router.navigate(["/users", userId, "edit"])
  }

  viewUserSongs(userId: number, event: Event): void {
    event.stopPropagation() // Prevent the card click event
    this.router.navigate(["/users", userId, "songs"])
  }

  deleteUser(userId: number, event: Event): void {
    event.stopPropagation() // Prevent the card click event
    if (confirm("Are you sure you want to delete this user?")) {
      this.usersService.deleteUser(userId)
    }
  }
}
