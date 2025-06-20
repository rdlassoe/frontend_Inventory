import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inventario } from '../../models/inventario.model';
import { CreateInventoryDto, UpdateInventoryDto } from '../../models/inventario.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private apiUrl = 'http://localhost:3000/inventory'; // Ajusta si tu API usa otro puerto/base URL

  constructor(private http: HttpClient) { }

  getAll(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.apiUrl);
  }

  updateByCodigo(codigo: string, dto: UpdateInventoryDto) {
  return this.http.put(`${this.apiUrl}/by-codigo/${codigo}`, dto);
}


  getByProductId(productId: number): Observable<Inventario> {
    return this.http.get<Inventario>(`${this.apiUrl}/${productId}`);
  }

  create(dto: CreateInventoryDto): Observable<Inventario> {
    return this.http.post<Inventario>(this.apiUrl, dto);
  }

  update(idinventario: number, dto: UpdateInventoryDto): Observable<Inventario> {
    return this.http.put<Inventario>(`${this.apiUrl}/${idinventario}`, dto);
  }

  delete(idinventario: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idinventario}`);
  }
}
