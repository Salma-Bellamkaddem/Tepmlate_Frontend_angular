import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { CoachListComponent } from './list/coach-list.component';
import { CoachDetailsComponent } from './details/coach-details.component';
import { CreateCooperativeComponent } from './create-cooperative/create-cooperative.component';
import { UpdateCooperativeComponent } from './update-cooperative/update-cooperative.component';


const routes: Routes = [
  { path: 'list', component: CoachListComponent },
  { path: 'details/:id', component: CoachDetailsComponent },
  { path: 'create-cooperative', component: CreateCooperativeComponent },
  { path: 'update-cooperative/:userId', component: UpdateCooperativeComponent },
  // 👈 ajout de cette route

  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: '**', redirectTo: 'list' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoachRoutingModule {}