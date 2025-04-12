import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CreateSportFieldComponent} from './create-sport-field.component'

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
          { path: '', component: CreateSportFieldComponent }
      ])],
  exports: [RouterModule]
})
export class SportFieldCreateRoutingModule { }
