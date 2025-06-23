import { Injectable } from '@angular/core';
import { Person } from '../../models/persona.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private apiUrl = 'http://localhost:3000/person'; // ajusta tu URL si es necesario

  constructor(private http: HttpClient) {}
  
  findAll(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiUrl);
  }

}
