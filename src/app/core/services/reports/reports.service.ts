// reports.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private baseUrl = 'http://localhost:3000/reports'; 

  constructor(private http: HttpClient) { }

  descargarReportePdf(query: any) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value) params = params.set(key, value as string);
    });

    return this.http.get(`${this.baseUrl}/reporte-general`, {
      params,
      responseType: 'blob', // muy importante
    });
  }
}
