import { Component, OnInit } from '@angular/core';
import { ValorizedInventory } from '../../core/models/report-response.dto';
import { ReportsService } from '../../core/services/reportes/reportes.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-valorized-inventory',
  imports:[HeaderComponent, FormsModule, CommonModule],
  templateUrl: './valorized-inventory.component.html',
  styleUrls: ['./valorized-inventory.component.scss']
})
export class ValorizedInventoryComponent implements OnInit {
  reportData: ValorizedInventory | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private reportsService: ReportsService,
    private authService: AuthService,
    private router: Router
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
    this.reportsService.getValorizedInventory().subscribe({
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