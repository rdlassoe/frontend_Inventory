import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User, CreateUserDto, } from '../../models/user.model';
import { Person } from '../../models/persona.model';

@Injectable({
  providedIn: 'root'
})
export class userService {

  private apiUrl = 'http://localhost:3000/user'; // Asegúrate de que esta URL coincida con tu backend
  private Url = 'http://localhost:3000/person';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  findAllEmpleados(): Observable<Person[]> {
      return this.http.get<Person[]>(this.Url).pipe(
        map((personas) =>
          personas.filter(p => p.tipo_personaid?.idtype_person === 1)
        )
      );
    }

  createUser(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/${id}`);
  }
}
