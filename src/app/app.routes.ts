import { Routes } from '@angular/router';
import { ErrorRouteNotExistComponent } from './shared/components/error-route-not-exist/error-route-not-exist.component';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
        canActivate: [AuthGuard]
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: '404',
        component: ErrorRouteNotExistComponent
    },
    {
        path: '**',
        redirectTo: '404',
        pathMatch: 'full'
    }
];
