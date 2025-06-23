import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { metodoPago } from '../../models/metodoPago.model';

@Injectable({
  providedIn: 'root'
})
export class metodoPagoService {
  private apiUrl = 'http://localhost:3000/payment-method'; // ajusta tu URL si es necesario

  constructor(private http: HttpClient) {}
  
  findAll(): Observable<metodoPago[]> {
    return this.http.get<metodoPago[]>(this.apiUrl);
  }

}
