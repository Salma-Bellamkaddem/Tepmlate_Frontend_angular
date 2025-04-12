import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        path: '', component: AppLayoutComponent,
        children: [
            { path: '', loadChildren: () => import('./amaClub/components/dashboards/dashboards.module').then(m => m.DashboardsModule) },
            { path: 'coaches', loadChildren: () => import('./amaClub/components/coach/coach.module').then(m => m.CoachModule) },
            {path: 'sportField', loadChildren: () => import('./amaClub/components/sportField/sport-field.module').then(m => m.SportFieldModule)}
                    ]
    },
    { path: 'auth', data: { breadcrumb: 'Auth' }, loadChildren: () => import('./amaClub/components/auth/auth.module').then(m => m.AuthModule) },
    { path: 'landing', loadChildren: () => import('./amaClub/components/landing/landing.module').then(m => m.LandingModule) },
    { path: 'notfound', loadChildren: () => import('./amaClub/components/notfound/notfound.module').then(m => m.NotfoundModule) },
    { path: 'notfound2', loadChildren: () => import('./amaClub/components/notfound2/notfound2.module').then(m => m.Notfound2Module) },
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
