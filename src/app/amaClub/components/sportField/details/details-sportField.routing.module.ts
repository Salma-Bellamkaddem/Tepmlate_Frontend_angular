import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetailsSportFieldComponent } from './details-sportField.component';



@NgModule({
  imports: [RouterModule.forChild([
          { path: '', component: DetailsSportFieldComponent }
      ])],
  exports: [RouterModule]
})

export class DetailsSportFieldRoutingModule{}
