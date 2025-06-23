import { metodoPago } from "./metodoPago.model";
import { Person } from "./persona.model";
import { Product } from "./producto.model";

export interface detalleVenta {
    idsale_detail: number;
    cantidad: number;
    precio_unitario: number;
    iva: number;
    producto: Product;
}

export interface venta {
    idsale: number;
    fecha_hora: Date;
    total: number;
    empleado: Person;
    cliente: Person;
    metodo_pago: metodoPago;
    detalles: detalleVenta[];
}