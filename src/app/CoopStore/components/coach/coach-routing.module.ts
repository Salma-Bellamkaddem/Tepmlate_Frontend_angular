import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
@NgModule({
    imports: [RouterModule.forChild([
        { path: 'list', data: {breadcrumb: 'List'}, loadChildren: () => import('./list/coach-list.module').then(m => m.CoachListModule) },
        { path: 'create', data: {breadcrumb: 'Create'}, loadChildren: () => import('./create/coach-create.module').then(m => m.CoachCreateModule) },
        { path: 'update', data: {breadcrumb: 'Update'}, loadChildren: () => import('./update/coach-update.module').then(m => m.CoachUpdateModule) },
        { path: 'details', data: {breadcrumb: 'Details'}, loadChildren: () => import('./details/coach-details.module').then(m => m.CoachDetailsModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class CoachRoutingModule { }
