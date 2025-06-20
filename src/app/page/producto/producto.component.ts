import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductService } from '../../core/services/product/product.service';
import { CategoryService } from '../../core/services/category/category.service';
import { CreateProductDto } from '../../core/models/product.dto';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';



@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {
  productos: Product[] = [];
  categorias: Category[] = [];
  filtro: string = '';
  productoEditandoId: number | null = null;
  mostrarModal = false;
  paginaActual: number = 1;
  productosPorPagina: number = 10;

  nuevoProducto: Partial<CreateProductDto> = {};



  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router
  ) { }

  cargarProductos() {
    this.productService.findAll().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

  cargarCategorias() {
    this.categoryService.findAll().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); // redirige si no hay token
      return;
    }

    this.cargarProductos();
    this.cargarCategorias();
  }

  get isAdmin(): boolean {
  return this.authService.getUserRole() === 'admin';
}

get isEditor(): boolean {
  return this.authService.getUserRole() === 'vendedor';
}


  crearProducto(form: NgForm) {
    if (this.productoEditandoId) {
      // Modo edición
      this.productService.update(this.productoEditandoId, this.nuevoProducto).subscribe({
        next: () => {
          this.cargarProductos();
          this.cancelarEdicion(form);
        },
        error: (err) => console.error('Error al actualizar producto', err)
      });
    } else {
      // Modo creación
      this.productService.create(this.nuevoProducto).subscribe({
        next: () => {
          this.cargarProductos();
          this.nuevoProducto = { categoria_id: 1 };
          form.resetForm({ categoria_id: 0 });
        },
        error: (err) => console.error('Error al crear producto', err)
      });
    }
  }
  editarProducto(producto: Product, form: NgForm) {
    this.productoEditandoId = producto.idproduct;

    this.nuevoProducto = {
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      categoria_id: producto.categoria.idcategoria,
      cantMinima: producto.cantMinima,
      costo: producto.costo,
      precio: producto.precio,
      iva: producto.iva
    };

    // Si quieres resetear el formulario visualmente
    form.setValue(this.nuevoProducto);
  }
  cancelarEdicion(form: NgForm) {
    this.productoEditandoId = null;
    this.nuevoProducto = {
      codigo: '',
      nombre: '',
      descripcion: '',
      categoria_id: 0,
      cantMinima: 0,
      costo: 0,
      precio: 0,
      iva: 0
    };
    form.resetForm({ categoria_id: 0 });
  }
  eliminarProducto(id: number) {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      this.productService.remove(id).subscribe({
        next: () => this.cargarProductos(),
        error: (err) => console.error('Error al eliminar producto', err)
      });
    }
  }
  get productosFiltrados(): Product[] {
    const texto = this.filtro.toLowerCase();
    return this.productos.filter(prod =>
      prod.nombre.toLowerCase().includes(texto) ||
      prod.codigo.toLowerCase().includes(texto)
    );
  }
  get productosPaginados(): Product[] {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;
    const fin = inicio + this.productosPorPagina;
    return this.productosFiltrados.slice(inicio, fin);
  }

  get totalPaginas(): number {
    return Math.ceil(this.productosFiltrados.length / this.productosPorPagina);
  }

  cambiarPagina(numero: number) {
    if (numero >= 1 && numero <= this.totalPaginas) {
      this.paginaActual = numero;
    }
  }

}
