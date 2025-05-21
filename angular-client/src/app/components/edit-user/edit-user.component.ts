import { Component, OnInit, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { User } from "../../models/user.model";
import { UsersService } from "../../services/users/users.service";
import { MatSnackBar } from "@angular/material/snack-bar";

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
    MatDialogModule
  ],
  templateUrl: "./edit-user.component.html",
  styleUrls: ["./edit-user.component.css"],
})
export class EditUserComponent implements OnInit {
  user: User = new User("", "", "", new Date(), 0);
  loading = true;
  hidePassword = true;

  constructor(
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }
  ) {}

  ngOnInit(): void {
    if (this.data.userId) {
      this.usersService.getUserById(this.data.userId).subscribe({
        next: (user) => {
          this.user = user;
          this.loading = false;
        },
        error: (error) => {
          console.error("Error fetching user:", error);
          this.loading = false;
          this.snackBar.open("Error loading user data", "Close", { duration: 3000 });
        },
      });
    } else {
      this.loading = false;
    }
  }

  saveUser(): void {
    this.loading = true;
    this.usersService.updateUser(this.data.userId, this.user).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open("User updated successfully", "Close", { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error:any) => {
        console.error("Error updating user:", error);
        this.loading = false;
        this.snackBar.open("Error updating user", "Close", { duration: 3000 });
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}