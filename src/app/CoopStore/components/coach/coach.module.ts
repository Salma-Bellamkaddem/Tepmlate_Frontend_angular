import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoachRoutingModule } from './coach-routing.module';

import { CoachListComponent } from './list/coach-list.component';
import { CoachDetailsComponent } from './details/coach-details.component';
import { CoachDetailsModule } from './details/coach-details.module';

@NgModule({
  imports: [
    CommonModule,
    CoachRoutingModule,
    CoachListComponent,
    CoachDetailsModule,
    
  
  ]
  // PAS DE declarations car standalone components
})
export class CoachModule { }