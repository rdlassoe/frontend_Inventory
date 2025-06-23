import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SalesByCategory } from '../../core/models/report-response.dto';
import { ReportsService } from '../../core/services/reportes/reportes.service';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sales-by-category',
  imports:[HeaderComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './sales-by-category.component.html',
  styleUrls: ['./sales-by-category.component.scss']
})
export class SalesByCategoryComponent implements OnInit {
  reportForm: FormGroup;
  reportData: SalesByCategory[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reportsService: ReportsService,
    private authService: AuthService,
    private router: Router
  ) {
    this.reportForm = this.fb.group({
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

  generateReport(): void {
    this.isLoading = true;
    this.errorMessage = null;
    const query = {
      startDate: this.reportForm.value.startDate || undefined,
      endDate: this.reportForm.value.endDate || undefined
    };

    this.reportsService.getSalesByCategory(query).subscribe({
      next: (data) => {
        this.reportData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = `Error al generar el reporte: ${err.message}`;
        this.isLoading = false;
      }
    });
  }
}