import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TopProduct } from '../../core/models/report-response.dto';
import { ReportsService } from '../../core/services/reportes/reportes.service';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-top-products',
  imports:[HeaderComponent, ReactiveFormsModule, CommonModule,],
  templateUrl: './top-products.component.html',
  styleUrls: ['./top-products.component.scss']
})
export class TopProductsComponent implements OnInit {
  reportForm: FormGroup;
  reportData: TopProduct[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  displayedColumns: string[] = ['producto', 'unidadesVendidas'];

  constructor(
    private fb: FormBuilder,
    private reportsService: ReportsService,
    private authService: AuthService,
    private router: Router
  ) {
    this.reportForm = this.fb.group({
      limit: [10]
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
    this.reportData = [];

    const query = { limit: this.reportForm.value.limit };

    this.reportsService.getTopProductsSold(query).subscribe({
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