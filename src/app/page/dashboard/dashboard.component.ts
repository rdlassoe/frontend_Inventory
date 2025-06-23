import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard/dashboard.service';
import { DashboardData } from '../../core/models/dashboard-data.model';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent,
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatListModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  data!: DashboardData;
  cargando = true;
  error = '';

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private authService: AuthService,
  ) { }


  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); // Redirige si no hay token
      return;
    }

    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.data = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar datos del dashboard';
        console.error(err);
        this.cargando = false;
      }
    });
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  get isEditor(): boolean {
    return this.authService.getUserRole() === 'vendedor';
  }

}
