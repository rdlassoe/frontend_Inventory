import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = 'http://localhost:3000/category';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }
}

