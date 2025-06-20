import { Product } from './product.model';

export interface Inventario {
    idinventory: number;
    producto_id: Product;
    cantidad: number;
    fecha_actualizacion: string;
}
