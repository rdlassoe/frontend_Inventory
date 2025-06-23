import { Category } from './categoria.model';

export interface Product {
    idproduct: number;
    codigo: string;
    nombre: string;
    descripcion?: string;
    cantMinima: number;
    costo?: number;
    precio?: number;
    iva?: number;
    categoria: Category;
}
