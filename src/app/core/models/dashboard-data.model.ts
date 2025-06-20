export interface LowStockProduct {
    id: number;
    nombre: string;
    cantidad: number;
    cantMinima: number;
}

export interface RecentMovement {
    fecha: string;
    producto: string;
    tipo: string;
    cantidad: number;
    usuario: string;
}

export interface ZeroStockProduct {
    id: number;
    nombre: string;
    cantidad: number;
}

export interface RecentSale {
    idsale: number;
    fecha_hora: string;
    cliente: string;
    total: number;
}

export interface TopSellingProduct {
    nombre: string;
    totalVendido: number;
}

export interface DashboardData {
    totalProductos: number;
    totalInventorio: number;
    ventasDia: number;
    ventasSemana: number;
    ventasMes: number;
    gananciaBruta: number;
    productoBajoStock: LowStockProduct[];
    movimientosRecientes: RecentMovement[];
    ceroStockProducto: ZeroStockProduct[];
    ventasRecientes: RecentSale[];
    productosMasVendidos: TopSellingProduct[];
}
