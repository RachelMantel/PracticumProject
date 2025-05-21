import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatDividerModule } from "@angular/material/divider"
import { MatDialog, MatDialogModule } from "@angular/material/dialog"
import { AddUserModalComponent } from "../add-user-modal/add-user-modal.component"
import { UsersService } from "../../services/users/users.service"
import { Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: "app-users",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule,
    MatDialogModule,
  ],
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"],
})
export class UsersComponent implements OnInit {
  users$ = this.usersService.users

  constructor(
    private usersService: UsersService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.usersService.getUsers().subscribe();
  }

  viewUserDetails(userId: number): void {
    this.router.navigate(["/users", userId])
  }

  viewUserSongs(userId: number, event: Event): void {
    event.stopPropagation() // Prevent the card click event
    this.router.navigate(["/users", userId, "songs"])
  }

  openAddUserModal(): void {
    const dialogRef = this.dialog.open(AddUserModalComponent, {
      width: "500px",
      panelClass: "add-user-dialog",
      disableClose: true,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Refresh the users list
        this.usersService.getUsers().subscribe();
      }
    })
  }
}
