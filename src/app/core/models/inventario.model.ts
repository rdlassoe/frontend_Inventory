import { Product } from './producto.model';

export interface Inventario {
    idinventory: number;
    producto_id: Product;
    cantidad: number;
    fecha_actualizacion: string;
}
