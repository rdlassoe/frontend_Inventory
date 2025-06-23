import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SalesSummary } from '../../core/models/report-response.dto';
import { ReportsService } from '../../core/services/reportes/reportes.service';
import { ReportQueryDto } from '../../core/models/report-query.dto';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sales-summary',
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './resumenventas.component.html',
  styleUrls: ['./resumenventas.component.scss']
})
export class resumenventasComponent implements OnInit {
  reportForm: FormGroup;
  reportData: SalesSummary[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  
  // Columnas para una tabla genérica
  displayedColumns: string[] = ['periodo', 'valorTotal', 'numeroTransacciones', 'productosVendidos'];

  constructor(
    private fb: FormBuilder,
    private reportsService: ReportsService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.reportForm = this.fb.group({
      period: ['month'], // Valor por defecto
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); // redirige si no hay token
      return;
    }
    this.generateReport();
  }

  get isAdmin(): boolean {
  return this.authService.getUserRole() === 'admin';
}

get isEditor(): boolean {
  return this.authService.getUserRole() === 'vendedor';
}

  generateReport(): void {
    if (this.reportForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.reportData = [];

    const query: ReportQueryDto = {
      period: this.reportForm.value.period,
      startDate: this.reportForm.value.startDate || undefined,
      endDate: this.reportForm.value.endDate || undefined
    };

    this.reportsService.getSalesSummaryByPeriod(query).subscribe({
      next: (data) => {
        this.reportData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = `Error al generar el reporte: ${err.message}`;
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}