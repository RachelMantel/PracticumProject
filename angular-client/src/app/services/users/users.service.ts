import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = 'https://tuneyourmood-server.onrender.com/api/User';
  public users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl).pipe(
      tap(data => this.users.next(data))
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  updateUser(id: number, user: User): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, user).pipe(
      tap(() => this.getUsers().subscribe())
    );
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user).pipe(
      tap(() => this.getUsers().subscribe())
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.getUsers().subscribe())
    );
  }
}
