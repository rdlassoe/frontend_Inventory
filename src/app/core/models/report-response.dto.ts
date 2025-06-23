// Interfaces para las respuestas de la API

// --- VENTAS ---
export interface SalesSummary {
    periodo: string;
    valorTotal: number;
    numeroTransacciones: number;
    productosVendidos: number;
}

export interface TopProduct {
    producto: string;
    unidadesVendidas: number;
}

export interface SalesByCategory {
    categoria: string;
    valorTotal: number;
}

export interface SalesByClient {
    cliente: string;
    valorTotalCompras: number;
    numeroDeCompras: number;
}

export interface SalesComparison {
    periodo1: {
        fechas: string;
        totalVendido: number;
    };
    periodo2: {
        fechas: string;
        totalVendido: number;
    };
}

// --- INVENTARIO ---
export interface LowStockProduct {
    // Asume la estructura de tu entidad Inventory, por ejemplo:
    id: number;
    cantidad: number;
    producto_id: {
        idproduct: number;
        nombre: string;
        cantMinima: number;
    };
}

export interface ValorizedInventory {
    valorTotalInventarioACosto: number;
    valorPotencialVenta: number;
}

export interface InventoryMovement {
    id: number;
    fecha: string;
    descripcion: string;
    producto: string;
    cantidad: number;
    tipoDeMovimiento: string;
    usuario: string;
}

export interface KardexMovement {
    fecha: string;
    descripcion: string;
    entrada: number;
    salida: number;
    existencias: number;
}

export interface ProductKardex {
    producto: {
        id: number;
        nombre: string;
        codigo: string;
    };
    stockInicial: number;
    movimientos: KardexMovement[];
}