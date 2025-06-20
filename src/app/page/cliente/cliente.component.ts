import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CreatePersonDto } from '../../core/models/person.dto';
import { Person } from '../../core/models/person.model';
import { TipoIdentificacion } from '../../core/models/tipo-identificacion.model';
import { AuthService } from '../../core/services/auth/auth.service';
import { HeaderComponent } from '../../components/header/header.component';
import { ClienteService } from '../../core/services/cliente/cliente.service';
import { TipoIdentificacionService } from '../../core/services/tipoidentificacion/tipoidentificacion.service';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {
  clientes: Person[] = [];
  tipoIdentificacion: TipoIdentificacion[] = [];
  filtro: string = '';
  clienteEditandoId: number | null = null;
  paginaActual: number = 1;
  clientesPorPagina: number = 10;

  // Solo el ID
  nuevoCliente: Partial<CreatePersonDto> = {
    tipo_personaid: 1 // Por defecto, cliente
  };

  constructor(
    private clienteService: ClienteService,
    private tipoIdService: TipoIdentificacionService,
    private authService: AuthService,
    private router: Router
  ) {}

  cargarClientes() {
    this.clienteService.findAllClientes().subscribe({
      next: (data) => this.clientes = data,
      error: (err) => console.error('Error al cargar clientes', err)
    });
  }

  cargarTiposIdentificacion() {
    this.tipoIdService.findAll().subscribe({
      next: (data) => this.tipoIdentificacion = data,
      error: (err) => console.error('Error al cargar tipos de identificación', err)
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargarClientes();
    this.cargarTiposIdentificacion();
  }

  crearCliente(form: NgForm) {
    if (this.clienteEditandoId) {
      // Editar cliente
      this.clienteService.update(this.clienteEditandoId, this.nuevoCliente as CreatePersonDto).subscribe({
        next: () => {
          this.cargarClientes();
          this.cancelarEdicion(form);
        },
        error: (err) => console.error('Error al actualizar cliente', err)
      });
    } else {
      // Crear nuevo cliente
      this.clienteService.create(this.nuevoCliente as CreatePersonDto).subscribe({
        next: () => {
          this.cargarClientes();
          this.nuevoCliente = { tipo_personaid: 1 }; // Reset al valor por defecto
          form.resetForm({ tipo_id: null });
        },
        error: (err) => console.error('Error al crear cliente', err)
      });
    }
  }

  editarCliente(cliente: Person, form: NgForm) {
    this.clienteEditandoId = cliente.idperson;
    this.nuevoCliente = {
      idperson: cliente.idperson,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      numero_identificacion: cliente.numero_identificacion,
      email: cliente.email,
      movil: cliente.movil,
      tipo_id: cliente.tipo_id?.idtipo_identificacion, // solo el ID
      tipo_personaid: cliente.tipo_personaid?.idtype_person // solo el ID
    };

    form.setValue(this.nuevoCliente);
  }

  cancelarEdicion(form: NgForm) {
    this.clienteEditandoId = null;
    this.nuevoCliente = {
      tipo_personaid: 1 // Reset a tipo cliente por defecto
    };
    form.resetForm({ tipo_id: null });
  }

  eliminarCliente(id: number) {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.clienteService.remove(id).subscribe({
        next: () => this.cargarClientes(),
        error: (err) => console.error('Error al eliminar cliente', err)
      });
    }
  }

  get clientesFiltrados(): Person[] {
    const texto = this.filtro.toLowerCase();
    return this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(texto) ||
      c.apellido.toLowerCase().includes(texto) ||
      c.numero_identificacion.toLowerCase().includes(texto)
    );
  }

  get clientesPaginados(): Person[] {
    const inicio = (this.paginaActual - 1) * this.clientesPorPagina;
    const fin = inicio + this.clientesPorPagina;
    return this.clientesFiltrados.slice(inicio, fin);
  }

  get totalPaginas(): number {
    return Math.ceil(this.clientesFiltrados.length / this.clientesPorPagina);
  }

  cambiarPagina(numero: number) {
    if (numero >= 1 && numero <= this.totalPaginas) {
      this.paginaActual = numero;
    }
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  get isEditor(): boolean {
    return this.authService.getUserRole() === 'vendedor';
  }
}