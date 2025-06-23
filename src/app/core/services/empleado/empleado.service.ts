import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreatePersonDto } from '../../models/persona.dto';
import { Person } from '../../models/persona.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = 'http://localhost:3000/person';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las personas y filtra aquellas que son empleado.
   * Esto se hace revisando si el campo tipo_personaid.idtype_person === 1
   */
  findAllEmpleados(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiUrl).pipe(
      map((personas) =>
        personas.filter(p => p.tipo_personaid?.idtype_person === 1)
      )
    );
  }

  /**
   * Obtiene un empleado específico por su ID
   */
  findOne(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo empleado.
   * Espera un objeto con tipo_id y tipo_personaid como objetos completos.
   */
  create(empleado: CreatePersonDto): Observable<Person> {
    return this.http.post<Person>(this.apiUrl, empleado);
  }

  /**
   * Actualiza un empleado existente
   */
  update(id: number, empleado: CreatePersonDto): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${id}`, empleado);
  }

  /**
   * Elimina un empleado por ID
   */
  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
