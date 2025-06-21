import { Component } from '@angular/core';
import { Person } from '../../core/models/person.model';
import { TipoIdentificacion } from '../../core/models/tipo-identificacion.model';
import { CreatePersonDto } from '../../core/models/person.dto';
import { EmpleadoService } from '../../core/services/empleado/empleado.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { TipoIdentificacionService } from '../../core/services/tipoidentificacion/tipoidentificacion.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './empleado.component.html',
  styleUrl: './empleado.component.scss'
})
export class EmpleadoComponent {
  empleados: Person[] = [];
  tipoIdentificacion: TipoIdentificacion[] = [];
  filtro: string = '';
  empleadoEditandoId: number | null = null;
  paginaActual: number = 1;
  empleadosPorPagina: number = 10;
  mostrarFormulario: boolean = false;

  // Solo el ID
  nuevoEmpleado: Partial<CreatePersonDto> = {
    tipo_personaid: 2 // Por defecto, empleado
  };

  constructor(
    private empleadoService: EmpleadoService,
    private tipoIdService: TipoIdentificacionService,
    private authService: AuthService,
    private router: Router
  ) { }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  get isEditor(): boolean {
    return this.authService.getUserRole() === 'vendedor';
  }

  cargarEmpleados() {
    this.empleadoService.findAllEmpleados().subscribe({
      next: (data) => this.empleados = data,
      error: (err) => console.error('Error al cargar empleados', err)
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

    this.cargarEmpleados();
    this.cargarTiposIdentificacion();
  }

  crearEmpleado(form: NgForm) {
    if (this.empleadoEditandoId) {
      // Editar empleado
      this.empleadoService.update(this.empleadoEditandoId, this.nuevoEmpleado as CreatePersonDto).subscribe({
        next: () => {
          this.cargarEmpleados();
          this.cancelarEdicion(form);
        },
        error: (err) => console.error('Error al actualizar cliente', err)
      });
    } else {
      // Crear nuevo empleado
      this.empleadoService.create(this.nuevoEmpleado as CreatePersonDto).subscribe({
        next: () => {
          this.cargarEmpleados();
          this.nuevoEmpleado = { tipo_personaid: 1 }; // Reset al valor por defecto
          form.resetForm({ tipo_id: null });
        },
        error: (err) => console.error('Error al crear cliente', err)
      });
    }
  }

  editarEmpleado(cliente: Person) {
    this.empleadoEditandoId = cliente.idperson;
    this.nuevoEmpleado = {
      idperson: cliente.idperson,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      numero_identificacion: cliente.numero_identificacion,
      email: cliente.email,
      movil: cliente.movil,
      tipo_id: cliente.tipo_id?.idtipo_identificacion, // solo el ID
      tipo_personaid: cliente.tipo_personaid?.idtype_person // solo el ID
    };
    this.mostrarFormulario = true;
  }

  cancelarEdicion(form: NgForm) {
    this.empleadoEditandoId = null;
    this.nuevoEmpleado = {
      tipo_personaid: 1 // Reset a tipo empleado por defecto
    };
    form.resetForm({ tipo_id: null });
    this.mostrarFormulario = false;
  }

  eliminarEmpleado(id: number) {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.empleadoService.remove(id).subscribe({
        next: () => this.cargarEmpleados(),
        error: (err) => console.error('Error al eliminar cliente', err)
      });
    }
  }

  get empleadosFiltrados(): Person[] {
    const texto = this.filtro.toLowerCase();
    return this.empleados.filter(c =>
      c.nombre.toLowerCase().includes(texto) ||
      c.apellido.toLowerCase().includes(texto) ||
      c.numero_identificacion.toLowerCase().includes(texto)
    );
  }

  get empleadosPaginados(): Person[] {
    const inicio = (this.paginaActual - 1) * this.empleadosPorPagina;
    const fin = inicio + this.empleadosPorPagina;
    return this.empleadosFiltrados.slice(inicio, fin);
  }

  get totalPaginas(): number {
    return Math.ceil(this.empleadosFiltrados.length / this.empleadosPorPagina);
  }

  cambiarPagina(numero: number) {
    if (numero >= 1 && numero <= this.totalPaginas) {
      this.paginaActual = numero;
    }
  }

  
}
