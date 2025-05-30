import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { RegisterComponent } from './CoopStore/components/register/register.component';
import { AuthGuard } from './CoopStore/guards/Auth.guard';
import { RoleGuard } from './CoopStore/guards/Role.guard';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        path: '', component: AppLayoutComponent,
        children: [
            { path: '', loadChildren: () => import('./CoopStore/components/dashboards/dashboards.module').then(m => m.DashboardsModule) },
            { path: 'coaches', loadChildren: () => import('./CoopStore/components/coach/coach.module').then(m => m.CoachModule) 
               // ,canActivate: [AuthGuard, RoleGuard], // On applique les deux gardes
                //data: { role: 'ADMIN'
                 }
          ,
            { 
                path: 'register', 
                component: RegisterComponent, 
               // canActivate: [AuthGuard, RoleGuard], // On applique les deux gardes
                //data: { role: 'ADMIN' } // On passe le rôle nécessaire pour cette route
              }

                    ]
    },
    { path: 'auth', data: { breadcrumb: 'Auth' }, loadChildren: () => import('./CoopStore/components/auth/auth.module').then(m => m.AuthModule) },
    { path: 'landing', loadChildren: () => import('./CoopStore/components/landing/landing.module').then(m => m.LandingModule) },
    { path: 'notfound', loadChildren: () => import('./CoopStore/components/notfound/notfound.module').then(m => m.NotfoundModule) },
    { path: 'notfound2', loadChildren: () => import('./CoopStore/components/notfound2/notfound2.module').then(m => m.Notfound2Module) },
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
