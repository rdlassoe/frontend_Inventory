import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypePerson } from '../../models/type-person.model';

@Injectable({ providedIn: 'root' })
export class TipoPersonaService {
  private apiUrl = 'http://localhost:3000/type-person';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los tipos de persona desde el backend
   */
  findAll(): Observable<TypePerson[]> {
    return this.http.get<TypePerson[]>(this.apiUrl);
  }
}