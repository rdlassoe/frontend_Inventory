import { Component, OnInit } from '@angular/core';

import { ReportsService } from '../../core/services/reportes/reportes.service';
import { LowStockProduct } from '../../core/models/report-response.dto';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-low-stock',
  imports: [ HeaderComponent, CommonModule],
  templateUrl: './low-stock.component.html',
  styleUrls: ['./low-stock.component.scss']
})
export class LowStockComponent implements OnInit {
  reportData: LowStockProduct[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private reportsService: ReportsService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); // redirige si no hay token
      return;
    }
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.reportsService.getProductsWithLowStock().subscribe({
      next: (data) => {
        this.reportData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = `Error al cargar el reporte: ${err.message}`;
        this.isLoading = false;
      }
    });
  }
}