import { Component, OnInit } from '@angular/core';
import { Category } from '../../core/models/categoria.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../core/services/category/category.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categoria',
  imports: [HeaderComponent, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.scss'
})
export class CategoriaComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  isEditing = false;
  selectedCategoryId: number | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  filtroCategoria: string = '';
  paginaActual: number = 1;
  categoriasPorPagina: number = 10;
  mostrarFormulario: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      descripcion_categoria: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadCategories();
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  get isEditor(): boolean {
    return this.authService.getUserRole() === 'vendedor';
  }

  loadCategories(): void {
    this.categoryService.findAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar las categorías. Intente de nuevo más tarde.';
        console.error(err);
      }
    });
  }

  get categoriasFiltradas(): Category[] {
    const texto = this.filtroCategoria.toLowerCase();
    return this.categories.filter(c =>
      c.descripcion_categoria.toLowerCase().includes(texto)
    );
  }

  get categoriasPaginadas(): Category[] {
    const inicio = (this.paginaActual - 1) * this.categoriasPorPagina;
    const fin = inicio + this.categoriasPorPagina;
    return this.categoriasFiltradas.slice(inicio, fin);
  }

  get totalPaginas(): number {
    return Math.ceil(this.categoriasFiltradas.length / this.categoriasPorPagina);
  }

  cambiarPagina(numero: number): void {
    if (numero >= 1 && numero <= this.totalPaginas) {
      this.paginaActual = numero;
    }
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return;

    this.clearMessages();
    const categoryData = this.categoryForm.value;

    if (this.isEditing && this.selectedCategoryId !== null) {
      this.categoryService.updateCategory(this.selectedCategoryId, categoryData).subscribe({
        next: (updatedCategory) => {
          this.successMessage = `Categoría "${updatedCategory.descripcion_categoria}" actualizada con éxito.`;
          this.loadCategories();
          this.resetForm();
          this.mostrarFormulario = false;
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    } else {
      this.categoryService.createCategory(categoryData).subscribe({
        next: (newCategory) => {
          this.successMessage = `Categoría "${newCategory.descripcion_categoria}" creada con éxito.`;
          this.loadCategories();
          this.resetForm();
          this.mostrarFormulario = false;
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    }
  }

  editCategory(category: Category): void {
    this.isEditing = true;
    this.selectedCategoryId = category.idcategoria;
    this.categoryForm.patchValue({
      descripcion_categoria: category.descripcion_categoria
    });
    this.clearMessages();
    this.mostrarFormulario = true;
  }

  deleteCategory(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta categoría?')) {
      this.clearMessages();
      this.categoryService.deleteCategory(id).subscribe({
        next: (removedCategory) => {
          this.successMessage = `Categoría "${removedCategory.descripcion_categoria}" eliminada con éxito.`;
          this.loadCategories();
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.selectedCategoryId = null;
    this.categoryForm.reset();
  }

  clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }

  cancelarEdicion(): void {
    this.resetForm();
    this.mostrarFormulario = false;
  }
}
