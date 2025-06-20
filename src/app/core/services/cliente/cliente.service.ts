import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreatePersonDto } from '../../models/person.dto';
import { Person } from '../../models/person.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:3000/person';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las personas y filtra aquellas que son clientes.
   * Esto se hace revisando si el campo tipo_personaid.nombre === 'cliente'
   */
  findAllClientes(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiUrl).pipe(
      map((personas) =>
        personas.filter(p => p.tipo_personaid?.idtype_person === 1)
      )
    );
  }

  /**
   * Obtiene un cliente específico por su ID
   */
  findOne(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo cliente.
   * Espera un objeto con tipo_id y tipo_personaid como objetos completos.
   */
  create(cliente: CreatePersonDto): Observable<Person> {
    return this.http.post<Person>(this.apiUrl, cliente);
  }

  /**
   * Actualiza un cliente existente
   */
  update(id: number, cliente: CreatePersonDto): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${id}`, cliente);
  }

  /**
   * Elimina un cliente por ID
   */
  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
