export interface CreateProductDto {
    codigo: string;
    nombre: string;
    descripcion?: string;
    categoria_id: number;
    cantMinima: number;
    costo?: number;
    precio?: number;
    iva?: number;
}