import { Component, OnInit } from '@angular/core';
import { Inventario } from '../../core/models/inventario.model';
import { CreateInventoryDto, UpdateInventoryDto } from '../../core/models/inventario.dto';
import { InventarioService } from '../../core/services/inventario/inventario.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product/product.service';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.scss'

})
export class InventarioComponent implements OnInit {
  inventario: Inventario[] = [];
  inventarioFiltrado: Inventario[] = [];
  productoBusqueda: string = '';
  productosEncontrados: Product[] = [];
  productoSeleccionado: Product | null = null;inventarioEditandoCodigo: string | null = null;



  // Estado del formulario
  nuevoInventario: CreateInventoryDto = { producto_id: 0, cantidad: 0 };
  inventarioEditandoId: number | null = null;

  // Buscador y paginación
  filtro: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  router: any;


  constructor(
    private inventoryService: InventarioService,
    private productService: ProductService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); // redirige si no hay token
      return;
    }
    this.cargarInventario();
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  get isEditor(): boolean {
    return this.authService.getUserRole() === 'vendedor';
  }

  cargarInventario(): void {
    this.inventoryService.getAll().subscribe((data) => {
      this.inventario = data;
      this.aplicarFiltro();
    });
  }

  aplicarFiltro(): void {
    const filtroTrim = this.filtro.trim().toLowerCase();

    if (!filtroTrim) {
      this.inventarioFiltrado = [...this.inventario];
    } else {
      this.inventarioFiltrado = this.inventario.filter((item) => {
        const nombre = item.producto_id?.nombre?.toLowerCase() || '';
        const codigo = item.producto_id?.codigo?.toLowerCase() || '';
        return nombre.includes(filtroTrim) || codigo.includes(filtroTrim);
      });
    }

    this.paginaActual = 1;
  }


  get totalPaginas(): number {
    return Math.ceil(this.inventarioFiltrado.length / this.elementosPorPagina);
  }

  get inventarioPaginado(): Inventario[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    return this.inventarioFiltrado.slice(inicio, inicio + this.elementosPorPagina);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  crearInventario(form: NgForm): void {
    const producto = this.productoSeleccionado;

    if (!producto) {
      console.error('Producto no encontrado en la búsqueda');
      return;
    }

    if (this.nuevoInventario.cantidad <= 0) {
      console.error('La cantidad debe ser mayor a cero');
      return;
    }

    // Buscar inventario existente SOLO por código
    const inventarioExistente = this.inventario.find(inv =>
      inv.producto_id.codigo.toLowerCase() === producto.codigo.toLowerCase()
    );

    if (inventarioExistente) {
      const nuevaCantidad = inventarioExistente.cantidad + this.nuevoInventario.cantidad;
      const dto: UpdateInventoryDto = { cantidad: nuevaCantidad };

      console.log('Inventario existente:', inventarioExistente);
      console.log('ID del inventario:', inventarioExistente?.idinventory);

      this.inventoryService.updateByCodigo(producto.codigo, dto).subscribe(() => {
        this.cargarInventario();
        this.limpiarFormulario(form);
      });
    } else {
      this.nuevoInventario.producto_id = producto.idproduct; // por si el backend lo requiere
      this.inventoryService.create(this.nuevoInventario).subscribe(() => {
        this.cargarInventario();
        this.limpiarFormulario(form);
      });
    }
  }

  private limpiarFormulario(form: NgForm): void {
    this.nuevoInventario = { producto_id: 0, cantidad: 0 };
    this.productoBusqueda = '';
    this.productoSeleccionado = null;
    form.resetForm(form);
  }





  editar(item: Inventario): void {
    this.inventarioEditandoId = item.producto_id.idproduct;
    this.nuevoInventario = {
      producto_id: item.producto_id.idproduct,
      cantidad: item.cantidad,
    };
  }

  actualizar(): void {
    if (!this.inventarioEditandoId) return;
    const dto: UpdateInventoryDto = {
      cantidad: this.nuevoInventario.cantidad,
    };
    this.inventoryService.update(this.inventarioEditandoId, dto).subscribe(() => {
      this.cancelarEdicion();
      this.cargarInventario();
    });
  }

  cancelarEdicion(): void {
    this.inventarioEditandoId = null;
    this.nuevoInventario = { producto_id: 0, cantidad: 0 };
  }

  eliminarInventario(productId: number): void {
    this.inventoryService.delete(productId).subscribe(() => {
      this.cargarInventario();
    });
  }
  buscarProducto(): void {
    if (this.productoBusqueda.length >= 2) {
      this.productService.buscarProducto(this.productoBusqueda).subscribe((res) => {
        this.productosEncontrados = res;
      });
    } else {
      this.productosEncontrados = [];
    }
  }

  seleccionarProducto(prod: Product): void {
    this.nuevoInventario.producto_id = prod.idproduct;
    this.productoBusqueda = `${prod.codigo} - ${prod.nombre}`;
    this.productoSeleccionado = prod; // ← Guardamos aquí
    this.productosEncontrados = [];
  }

}
