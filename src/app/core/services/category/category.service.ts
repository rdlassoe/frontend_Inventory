import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Category } from '../../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  getCategories() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:3000/category';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }
  getCategoryById(id: number): Observable<Category> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Category>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva categoría
   * Corresponde a: POST /category
   * @param category Los datos de la nueva categoría
   */
  createCategory(category: Omit<Category, 'idcategoria'>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza una categoría existente
   * Corresponde a: PUT /category/:id
   * @param id El ID de la categoría a actualizar
   * @param category Los nuevos datos para la categoría
   */
  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Category>(url, category).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina una categoría
   * Corresponde a: DELETE /category/:id
   * @param id El ID de la categoría a eliminar
   */
  deleteCategory(id: number): Observable<Category> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Category>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejador de errores centralizado para las peticiones HTTP
   * @param error El error de la respuesta HTTP
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de la red
      console.error('An error occurred:', error.error.message);
    } else {
      // El backend retornó un código de error
      // El cuerpo de la respuesta puede contener la clave del error
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    // Retorna un observable con un mensaje de error legible por el usuario
    return throwError(
      () => new Error(error.error.message || 'Something bad happened; please try again later.')
    );
  }
}

