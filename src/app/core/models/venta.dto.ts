// src/app/models/sale.dto.ts
export interface productDetailDto{
    producto_id: number;
    cantidad: number;
}

export interface CreateSaleDetailDto {
    producto_id: number;
    cantidad: number;
}

export interface CreateSaleDto {
    cliente_id: number;
    empleado_id: number;
    metodo_pago_id: number;
    productos: productDetailDto[];
}

export type UpdateSaleDto = Partial<CreateSaleDto>;
