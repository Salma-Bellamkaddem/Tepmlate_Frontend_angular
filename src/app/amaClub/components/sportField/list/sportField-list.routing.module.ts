import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SportFieldListComponent } from './sportField-list.component';



@NgModule({
  imports: [RouterModule.forChild([
          { path: '', component: SportFieldListComponent }
      ])],
  exports: [RouterModule]
})

export class SportFieldListRoutingModule{}
