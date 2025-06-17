import { Routes } from '@angular/router';
import { ProductoComponent } from './page/producto/producto.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { LoginComponent } from './page/login/login.component';

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
        path:"login",
        component: LoginComponent
    }
];
