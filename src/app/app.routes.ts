import { Routes } from '@angular/router';
import { ProductoComponent } from './page/producto/producto.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { LoginComponent } from './page/login/login.component';
import { ClienteComponent } from './page/cliente/cliente.component';
import { EmpleadoComponent } from './page/empleado/empleado.component';


export const routes: Routes = [
    {
        path: "dashboard",
        component: DashboardComponent
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
        path:"login",
        component: LoginComponent
    },
    { path: '**', redirectTo: 'login' },
];
