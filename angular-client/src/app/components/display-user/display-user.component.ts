import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-display-user',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './display-user.component.html',
  styleUrl: './display-user.component.css'
})
export class DisplayUserComponent {
  @Input() user: User;

  @Output() saveUser: EventEmitter<User> = new EventEmitter<User>();
  @Output() cancelUser: EventEmitter<null> = new EventEmitter<null>();

  save() {
    this.saveUser.emit(this.user);
  }

  cancel() {
    this.cancelUser.emit(null);
  }
}
