import { Routes } from '@angular/router';
import { ProductoComponent } from './page/producto/producto.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { LoginComponent } from './page/login/login.component';
import { ClienteComponent } from './page/cliente/cliente.component';
import { EmpleadoComponent } from './page/empleado/empleado.component';
import { InventarioComponent, } from './page/inventario/inventario.component';
import { VentaComponent } from './page/venta/venta.component';
import { resumenventasComponent } from './page/resumenventas/resumenventas.component';
import { TopProductsComponent } from './page/top-products/top-products.component';
import { SalesByCategoryComponent } from './page/sales-by-category/sales-by-category.component';
import { salescomparisonComponent } from './page/sales-camparison/sales-camparison.component';
import { LowStockComponent } from './page/low-stock/low-stock.component';
import { ValorizedInventoryComponent } from './page/valorized-inventory/valorized-inventory.component';
import { FacturasComponent } from './page/facturas/facturas.component';
import { UsuarioComponent } from './page/user/user.component';

export const routes: Routes = [
    {
        path: "dashboard",
        component: DashboardComponent,
    },
    {
        path: 'reportes/sales-summary',
        component: resumenventasComponent,
    },
    {
        path: 'reportes/top-products',
        component: TopProductsComponent,
    },
    {
        path: 'reportes/sales-by-category',
        component: SalesByCategoryComponent,
    },
    {
        path: 'reportes/sales-comparison',
        component: salescomparisonComponent,
    },
    {
        path: 'reportes/low-stock',
        component: LowStockComponent,
    },
    {
        path: 'reportes/valorized-inventory',
        component: ValorizedInventoryComponent,
    },
    {
        path: "inventario",
        component: InventarioComponent
    },
    {
        path: "venta",
        component: VentaComponent
    },
    {
        path: "facturas",
        component: FacturasComponent
    },
    {
        path: "producto",
        component: ProductoComponent
    },
    {
        path: "cliente",
        component: ClienteComponent
    },
    {
        path: "empleado",
        component: EmpleadoComponent
    },
    {
        path: "usuario",
        component: UsuarioComponent
    },
    {
        path: "login",
        component: LoginComponent
    },
    { path: '**', redirectTo: 'login' },
];
