import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [RouterModule.forChild([
      { path: 'create', data: {breadcrumb: 'Create'}, loadChildren: () => import('./create/sport-field-create.module').then(m => m.SportFieldCreateModule) },
      { path: 'list', data: {breadcrumb: 'List'}, loadChildren: () => import('./list/sportField-list.module').then(m => m.SportFieldListModule) },
      { path: 'details', data: {breadcrumb: 'Details'}, loadChildren: () => import('./details/details-sportField.module').then(m => m.DetailsSportFieldModule) },
      { path: 'update', data: {breadcrumb: 'Update'}, loadChildren: () => import('./update/sportField-update.module').then(m => m.SportFieldUpdateModule) },
  
  ])],
  exports: [RouterModule]
})
export class SportFieldRoutingModule { }
