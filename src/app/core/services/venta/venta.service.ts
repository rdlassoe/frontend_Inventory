// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class VentaService {

//   constructor() { }
// }
// src/app/services/sale.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { venta } from '../../models/venta.model';
import { CreateSaleDto, UpdateSaleDto } from '../../models/venta.dto';
import { Person } from '../../models/persona.model';
import { metodoPago } from '../../models/metodoPago.model';

@Injectable({
  providedIn: 'root'
})
export class ventaService {
  private apiUrl = 'http://localhost:3000/sale';
  private Url = 'http://localhost:3000/person';
  private apiUrlm = 'http://localhost:3000/payment-method'; // ajusta tu URL si es necesario




  constructor(private http: HttpClient) {}

  findAll(): Observable<venta[]> {
    return this.http.get<venta[]>(this.apiUrl);
  }

  findAllmetodoPago(): Observable<metodoPago[]> {
      return this.http.get<metodoPago[]>(this.apiUrlm);
    }
  

  findAllEmpleados(): Observable<Person[]> {
      return this.http.get<Person[]>(this.Url).pipe(
        map((personas) =>
          personas.filter(p => p.tipo_personaid?.idtype_person === 1)
        )
      );
    }

    findAllClientes(): Observable<Person[]> {
    return this.http.get<Person[]>(this.Url).pipe(
      map((personas) =>
        personas.filter(p => p.tipo_personaid?.idtype_person === 2)
      )
    );
  }

  findOne(id: number): Observable<venta> {
    return this.http.get<venta>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateSaleDto): Observable<venta> {
    return this.http.post<venta>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateSaleDto): Observable<venta> {
    return this.http.patch<venta>(`${this.apiUrl}/${id}`, dto);
  }

  remove(id: number): Observable<venta> {
    return this.http.delete<venta>(`${this.apiUrl}/${id}`);
  }

  descargarFactura(idVenta: number) {
    return this.http.get(`${this.apiUrl}/factura/${idVenta}`, {
      responseType: 'blob', // ¡Esto es importante para recibir el PDF como archivo!
    });
  }

}
