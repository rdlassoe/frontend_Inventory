import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { ReportsService } from '../../core/services/reports/reports.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  [x: string]: any;
  @Output() closeSidebar = new EventEmitter<void>();
  showSubmenu = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private reportsService: ReportsService,
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); // redirige si no hay token
      return;
    }
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  get isEditor(): boolean {
    return this.authService.getUserRole() === 'vendedor';
  }

  onClose() {
    this.closeSidebar.emit();
  }

  logout() {
    // Limpia token si usas uno
    localStorage.removeItem('token'); // o authService.logout() si lo tienes

    // Redirige al login
    this.router.navigate(['/login']);

    // Cierra la sidebar
    this.onClose();

  }

  descargarReporte() {
  const query = {
    startDate: '2025-06-01',
    endDate: '2025-06-21',
    period: 'month',
    limit: 10
  };

  this.reportsService.descargarReportePdf(query).subscribe(blob => {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = 'reporte-general.pdf';
    a.click();
    URL.revokeObjectURL(objectUrl);
  });
}

}

