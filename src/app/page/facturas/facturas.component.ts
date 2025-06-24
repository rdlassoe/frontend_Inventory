import { Component } from '@angular/core';
import { ventaService } from '../../core/services/venta/venta.service';
import { venta } from '../../core/models/venta.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-facturas',
  imports: [HeaderComponent, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './facturas.component.html',
  styleUrl: './facturas.component.scss'
})
export class FacturasComponent {
  ventas: venta[] = [];
  paginaActual: number = 1;
  itemsPorPagina: number = 6;
  filtro: string = '';
  ventaSeleccionada: venta | null = null;
  mostrarModal: boolean = false;

  constructor(
    private ventaService: ventaService,
    private authService: AuthService,
    private router: Router,
  ) {
  }
  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); // redirige si no hay token
      return;
    }
    this.cargarVentas();
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }
  cargarVentas(): void {
    this.ventaService.findAll().subscribe({
      next: (data) => this.ventas = data,
      error: (err) => console.error('Error al cargar ventas', err)
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta factura? Esta acción no se puede deshacer.')) {
      this.ventaService.remove(id).subscribe(() => this.cargarVentas());
    }
  }

  ver(id: number): void {
    this.ventaService.findOne(id).subscribe({
      next: (data) => {
        this.ventaSeleccionada = data;
        console.log('Detalles de la venta:', this.ventaSeleccionada);
      },
      error: (err) => console.error(`Error al buscar la venta #${id}`, err)
    });
  }

  cerrarModal(): void {
    this.ventaSeleccionada = null;
  }

  get ventasFiltradas(): venta[] {
    if (!this.filtro) return this.ventas;
    const filtroLower = this.filtro.toLowerCase();

    return this.ventas.filter(v =>
      v.idsale.toString().includes(this.filtro) ||
      v.cliente?.nombre?.toLowerCase().includes(filtroLower) ||
      v.cliente?.numero_identificacion?.toLowerCase().includes(filtroLower)
    );
  }

  get ventasPaginadas(): venta[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.ventasFiltradas.slice(inicio, fin);
  }

  get totalPaginas(): number {
    return Math.ceil(this.ventasFiltradas.length / this.itemsPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
  }

  descargarFactura(idVenta: number) {
    this.ventaService.descargarFactura(idVenta).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `factura_venta_${idVenta}.pdf`;
        link.click();

        // Liberar la URL creada
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar factura', err);
        alert('Ocurrió un error al generar la factura.');
      }
    });
  }

}
