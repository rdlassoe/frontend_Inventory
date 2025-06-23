import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalesComparison } from '../../core/models/report-response.dto';
import { ReportsService } from '../../core/services/reportes/reportes.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sales-comparison',
  imports:[CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './sales-camparison.component.html',
  styleUrls: ['./sales-camparison.component.scss']
})
export class salescomparisonComponent {
  reportForm: FormGroup;
  reportData: SalesComparison | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reportsService: ReportsService,
    private authService: AuthService,
    private router: Router
  ) {
    this.reportForm = this.fb.group({
      startDate1: ['', Validators.required],
      endDate1: ['', Validators.required],
      startDate2: ['', Validators.required],
      endDate2: ['', Validators.required],
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
    if (this.reportForm.invalid) {
      this.errorMessage = "Todos los campos de fecha son requeridos.";
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;

    this.reportsService.getSalesComparison(this.reportForm.value).subscribe({
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