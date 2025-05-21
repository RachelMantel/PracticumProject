import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatDialogRef } from "@angular/material/dialog"
import { trigger, transition, style, animate } from "@angular/animations"
import { User } from "../../models/user.model"
import { UsersService } from "../../services/users/users.service"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: "app-add-user-modal",
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
  templateUrl: "./add-user-modal.component.html",
  styleUrls: ["./add-user-modal.component.css"],
  animations: [
    trigger("fadeIn", [transition(":enter", [style({ opacity: 0 }), animate("300ms", style({ opacity: 1 }))])]),
    trigger("slideIn", [
      transition(":enter", [
        style({ transform: "translateY(20px)", opacity: 0 }),
        animate("300ms", style({ transform: "translateY(0)", opacity: 1 })),
      ]),
    ]),
  ],
})
export class AddUserModalComponent {
  newUser: User = new User("", "", "", new Date(),0)
  hidePassword = true
  loading = false
  formSubmitted = false

  constructor(
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddUserModalComponent>,
  ) {}

  addUser(): void {
    this.formSubmitted = true

    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.snackBar.open("Please fill in all required fields", "Close", { duration: 3000 })
      return
    }

    this.loading = true

    // Make sure dateRegistration is set to current date
    this.newUser.dateRegistration = new Date()

    this.usersService.addUser(this.newUser).subscribe({
      next: () => {
        this.loading = false
        this.snackBar.open("User added successfully", "Close", { duration: 3000 })
        this.dialogRef.close(true)
      },
      error: (error) => {
        this.loading = false
        console.error("Error adding user:", error)
        this.snackBar.open("Error adding user: " + (error.message || "Unknown error"), "Close", { duration: 3000 })
      },
    })
  }

  cancel(): void {
    this.dialogRef.close(false)
  }
}
