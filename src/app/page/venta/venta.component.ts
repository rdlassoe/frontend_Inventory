// venta.component.ts (versión final y más eficiente)

import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../core/models/producto.model';
import { Person } from '../../core/models/persona.model';
import { metodoPago } from '../../core/models/metodoPago.model';
import { ventaService } from '../../core/services/venta/venta.service';
import { ProductService } from '../../core/services/product/product.service';
import { CreateSaleDto } from '../../core/models/venta.dto';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { venta } from '../../core/models/venta.model';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { PersonaService } from '../../core/services/persona/persona.service';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, ReactiveFormsModule],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.scss'
})
export class VentaComponent implements OnInit {
  form: FormGroup;
  loggedInEmployeeName: string = 'Cargando...';
  productosDisponibles: Product[] = [];
  clientes: Person[] = [];
  empleados: Person[] = [];
  metodoPago: metodoPago[] = [];
  ventas: venta[] = [];
  productoBusqueda = '';
  clienteBusqueda = '';
  productosFiltrados: Product[] = [];
  clientesFiltrados: Person[] = [];
  clienteSeleccionado = false;
  submissionError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private ventaService: ventaService,
    private personaService: PersonaService,
    private producotService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      cliente_id: [null, Validators.required],
      empleado_id: [{ value: null, disabled: true }, Validators.required],
      metodo_pago_id: [null, Validators.required],
      productos: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); // redirige si no hay token
      return;
    }
    this.cargarDatosGenerales();
  }
  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  /**
   * Carga los datos restantes necesarios para el formulario.
   */
  cargarDatosGenerales(): void {
    this.producotService.findAll().subscribe(data => this.productosDisponibles = data);
    this.personaService.findAll().subscribe(data => this.clientes = data);
    this.ventaService.findAllmetodoPago().subscribe(metodos => {
      this.metodoPago = metodos;
      this.setDefaultMetodoPago();
    });
    this.ventaService.findAllEmpleados().subscribe(empleados => {
      this.empleados = empleados;
      this.setupCurrentEmployee();
    });
  }

  private setDefaultMetodoPago(): void {
    // Asegurarse de que la lista de métodos de pago esté cargada
    if (this.metodoPago.length > 0) {
      // Busca el método de pago cuya descripción sea 'Efectivo' (ignorando mayúsculas/minúsculas)
      const efectivo = this.metodoPago.find(
        metodo => metodo.description.toLowerCase().trim() === 'efectivo'
      );

      // Si se encuentra, establece su ID en el control del formulario
      if (efectivo) {
        this.form.get('metodo_pago_id')?.setValue(efectivo.idpayment_method);
      }
    }
  }

  setupCurrentEmployee(): void {
    const personaId = this.authService.getPersonaId();
    if (!personaId) {
      this.loggedInEmployeeName = 'Error: No se pudo identificar al empleado.';
      this.form.get('empleado_id')?.setErrors({ required: true });
      console.error('El token JWT no contiene el campo "persona_id".');
      return;
    }

    // Establece el ID en el formulario inmediatamente.
    this.form.get('empleado_id')?.setValue(personaId);

    // Carga la lista de empleados para encontrar el nombre.
    this.ventaService.findAllEmpleados().subscribe(empleados => {
      this.empleados = empleados;
      const currentEmployee = this.empleados.find(e => e.idperson === personaId);
      if (currentEmployee) {
        this.loggedInEmployeeName = `${currentEmployee.nombre} ${currentEmployee.apellido}`;
      } else {
        this.loggedInEmployeeName = 'Empleado no encontrado en el sistema.';
        this.form.get('empleado_id')?.setErrors({ notFound: true });
      }
    });
  }

  // --- NUEVOS MÉTODOS PARA LA GESTIÓN DE CLIENTES ---

  /**
   * Busca clientes por nombre, apellido o identificación mientras el usuario escribe.
   */
  buscarClientes(): void {
    if (this.clienteSeleccionado) {
      this.clienteSeleccionado = false;
      this.form.get('cliente_id')?.setValue(null);
    }

    if (!this.clienteBusqueda) {
      this.clientesFiltrados = [];
      return;
    }
    const filtro = this.clienteBusqueda.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(filtro) ||
      c.apellido.toLowerCase().includes(filtro) ||
      c.numero_identificacion?.toLowerCase().includes(filtro) // Asumiendo que el modelo Person tiene 'identificacion'
    );
  }

  seleccionarClienteConEnter(): void {
    // Si la lista de resultados no está vacía...
    if (this.clientesFiltrados.length > 0) {
      // ...selecciona el primer elemento.
      this.seleccionarCliente(this.clientesFiltrados[0]);
    }
  }
  /**
   * Se ejecuta al seleccionar un cliente de la lista de resultados.
   * @param cliente El cliente seleccionado.
   */
  seleccionarCliente(cliente: Person): void {
    this.form.get('cliente_id')?.setValue(cliente.idperson);
    this.clienteBusqueda = `${cliente.nombre} ${cliente.apellido}`;
    this.clientesFiltrados = [];
    this.clienteSeleccionado = true;
  }

  /**
   * Limpia la selección actual del cliente.
   */
  limpiarCliente(): void {
    this.form.get('cliente_id')?.setValue(null);
    this.clienteBusqueda = '';
    this.clientesFiltrados = [];
    this.clienteSeleccionado = false;
  }

  get productos(): FormArray {
    return this.form.get('productos') as FormArray;
  }

  buscarProductos(): void {
    if (!this.productoBusqueda.trim()) {
      this.productosFiltrados = [];
      return;
    }
    const filtro = this.productoBusqueda.toLowerCase();
    this.productosFiltrados = this.productosDisponibles.filter(p =>
      p.nombre.toLowerCase().includes(filtro) ||
      p.codigo.toLowerCase().includes(filtro)
    );
  }

  seleccionarProductoPorEnter(): void {
    if (this.productosFiltrados.length > 0) {
      this.addProductoDesdeBusqueda(this.productosFiltrados[0]);
    }
  }

  addProductoDesdeBusqueda(producto: Product): void {
    // Opcional: Verificar si el producto ya está en el carrito para solo aumentar la cantidad
    const productoExistente = this.productos.controls.find(control => control.get('producto_id')?.value === producto.idproduct);

    if (productoExistente) {
      // Si ya existe, simplemente incrementa la cantidad
      const cantidadActual = productoExistente.get('cantidad')?.value;
      productoExistente.get('cantidad')?.setValue(cantidadActual + 1);
    } else {
      // Si no existe, lo añade a la lista
      this.productos.push(this.fb.group({
        producto_id: [producto.idproduct, Validators.required],
        nombre: [producto.nombre], // <-- Guardamos datos extra para mostrarlos fácilmente
        codigo: [producto.codigo],
        precio: [producto.precio],
        cantidad: [1, [Validators.required, Validators.min(1)]]
      }));
    }
    // Limpia el campo de búsqueda y los resultados
    this.productoBusqueda = '';
    this.productosFiltrados = [];
  }

  eliminarProducto(index: number): void {
    this.productos.removeAt(index);
  }

  calcularSubtotal(control: any): number {
    const cantidad = control.get('cantidad')?.value || 0;
    const precio = control.get('precio')?.value || 0;
    return cantidad * precio;
  }

  calcularTotal(): number {
    // Usamos reduce para una forma más funcional y limpia de sumar
    return this.productos.controls.reduce((total, control) => {
      const precio = control.get('precio')?.value || 0;
      const cantidad = control.get('cantidad')?.value || 0;
      return total + (precio * cantidad);
    }, 0);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'F10') {
      event.preventDefault(); // Previene el comportamiento por defecto del navegador
      this.submit();
    }
  }

  submit(): void {
    this.submissionError = null;

    if (this.productos.length === 0) {
      this.submissionError = 'Debe agregar al menos un producto a la venta.';
      return;
    }

    if (this.form.invalid) {
      console.error("Formulario inválido", this.form.errors);
      this.submissionError = 'Por favor, complete todos los campos requeridos.';
      return;
    }

    const formValue = this.form.getRawValue();

    const dto: CreateSaleDto = {
      empleado_id: Number(formValue.empleado_id),
      cliente_id: Number(formValue.cliente_id),
      metodo_pago_id: Number(formValue.metodo_pago_id),
      productos: formValue.productos.map((p: any) => ({
        producto_id: Number(p.producto_id),
        cantidad: Number(p.cantidad)
      }))
    };

    this.ventaService.create(dto).subscribe({
      next: venta => {
        alert(`Venta FAC-#0${venta.idsale} registrada correctamente`);
        this.form.reset();
        this.productos.clear();
        this.setupCurrentEmployee();
        this.clienteBusqueda = '';
        this.clienteSeleccionado = false;
        this.setDefaultMetodoPago(); // <-- Volvemos a poner el método de pago por defecto
      },
      error: (err) => {
        console.error('Error recibido del backend:', err);
        if (err.error && typeof err.error.message === 'string') {
          this.submissionError = err.error.message;
        } else {
          this.submissionError = 'Ocurrió un error inesperado al registrar la venta.';
        }
      }
    });
  }
}