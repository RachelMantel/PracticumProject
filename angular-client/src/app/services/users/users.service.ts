import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = 'https://tuneyourmood-server.onrender.com/api/User';
  public users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient) {}

  getUsers() {
    this.http.get<User[]>(this.baseUrl).subscribe(data => this.users.next(data));
  }

  getUserById(id: number) {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  updateUser(id: number, user: User) {
    this.http.put(`${this.baseUrl}/${id}`, user).subscribe(() => this.getUsers());
  }

  deleteUser(id: number) {
    this.http.delete(`${this.baseUrl}/${id}`).subscribe(() => this.getUsers());
  }
}
