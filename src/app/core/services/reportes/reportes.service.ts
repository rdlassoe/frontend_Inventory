import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryMovement, LowStockProduct, ProductKardex, SalesByCategory, SalesByClient, SalesComparison, SalesSummary, TopProduct, ValorizedInventory } from '../../models/report-response.dto';
import { ComparisonQueryDto, ReportQueryDto } from '../../models/report-query.dto';


@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:3000';
  private readonly API_URL = `${this.apiUrl}/reports`; // Asegúrate de tener apiUrl en tu environment.ts

  constructor(private http: HttpClient) { }

  private createHttpParams(query: ReportQueryDto | ComparisonQueryDto): HttpParams {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params = params.append(key, String(value));
      }
    });
    return params;
  }

  // --- REPORTES DE VENTAS ---

  getSalesSummaryByPeriod(query: ReportQueryDto): Observable<SalesSummary[]> {
    const params = this.createHttpParams(query);
    return this.http.get<SalesSummary[]>(`${this.API_URL}/sales/summary-by-period`, { params });
  }

  getTopProductsSold(query: ReportQueryDto): Observable<TopProduct[]> {
    const params = this.createHttpParams(query);
    return this.http.get<TopProduct[]>(`${this.API_URL}/sales/top-products`, { params });
  }

  getSalesByCategory(query: ReportQueryDto): Observable<SalesByCategory[]> {
    const params = this.createHttpParams(query);
    return this.http.get<SalesByCategory[]>(`${this.API_URL}/sales/by-category`, { params });
  }

  getSalesByClient(query: ReportQueryDto): Observable<SalesByClient[]> {
    const params = this.createHttpParams(query);
    return this.http.get<SalesByClient[]>(`${this.API_URL}/sales/by-client`, { params });
  }

  getSalesComparison(query: ComparisonQueryDto): Observable<SalesComparison> {
    const params = this.createHttpParams(query);
    return this.http.get<SalesComparison>(`${this.API_URL}/sales/comparison`, { params });
  }

  // --- REPORTES DE INVENTARIO ---

  getProductsWithLowStock(): Observable<LowStockProduct[]> {
    return this.http.get<LowStockProduct[]>(`${this.API_URL}/inventory/low-stock`);
  }

  getValorizedInventory(): Observable<ValorizedInventory> {
    return this.http.get<ValorizedInventory>(`${this.API_URL}/inventory/valorized`);
  }

  getInventoryMovements(query: ReportQueryDto): Observable<InventoryMovement[]> {
    const params = this.createHttpParams(query);
    return this.http.get<InventoryMovement[]>(`${this.API_URL}/inventory/movements`, { params });
  }

  getProductKardex(productId: number, query: ReportQueryDto): Observable<ProductKardex> {
    const params = this.createHttpParams(query);
    return this.http.get<ProductKardex>(`${this.API_URL}/inventory/kardex/${productId}`, { params });
  }
}