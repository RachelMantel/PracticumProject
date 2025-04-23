// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule, Router } from '@angular/router';
// import { MatCardModule } from '@angular/material/card';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { UsersService } from '../../services/users/users.service';
// import { User } from '../../models/user.model';
// import { DisplayUserComponent } from '../display-user/display-user.component';

// @Component({
//   selector: 'app-users',
//   standalone: true,
//   imports: [CommonModule,MatCardModule, MatIconModule, MatButtonModule, RouterModule,DisplayUserComponent],
//   templateUrl: './users.component.html',
//   styleUrl: './users.component.css'
// })
// export class UsersComponent {
//   users$ = this.usersService.users;
//   // displayUser:User=new User('','','',new Date(),0);
//   show=false;
//   displayUserId=0;
//   constructor(private usersService: UsersService, private router: Router) {}

//   ngOnInit(): void {
//     this.usersService.getUsers();
//   }

//   showUserDetails(id: number) {
//       this.show=true;
//       this.displayUserId=id;
//       // this.usersService.getUserById(id).subscribe(user => {
//       //   this.displayUser = user;
//       // });
//   }

//   deleteUser(id: number) {
//     this.usersService.deleteUser(id);
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users/users.service';
import { User } from '../../models/user.model';
import { DisplayUserComponent } from '../display-user/display-user.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, DisplayUserComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users$ = this.usersService.users;
  editFlag = false;
  userToEdit: User;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.usersService.getUsers();
  }

  edit(user: User) {
    this.userToEdit = { ...user }; // כדי לא לשנות את המקור בטעות
    this.editFlag = true;
  }

  saveUser(updatedUser: User) {
    this.usersService.updateUser(updatedUser.id, updatedUser);
    this.editFlag = false;
  }

  cancelEdit() {
    this.editFlag = false;
  }

  deleteUser(userId: number) {
    console.log(userId);
    this.usersService.deleteUser(userId);
  }
}
