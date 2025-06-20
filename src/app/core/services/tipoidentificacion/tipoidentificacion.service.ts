import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoIdentificacion } from '../../models/tipo-identificacion.model';

@Injectable({ providedIn: 'root' })
export class TipoIdentificacionService {
  private apiUrl = 'http://localhost:3000/tipo-identificacion'; // Ajusta si la ruta del backend es diferente

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los tipos de identificación desde el backend
   */
  findAll(): Observable<TipoIdentificacion[]> {
    return this.http.get<TipoIdentificacion[]>(this.apiUrl);
  }
}