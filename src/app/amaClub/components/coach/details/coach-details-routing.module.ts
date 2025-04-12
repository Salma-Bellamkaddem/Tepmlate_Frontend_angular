import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {CoachDetailsComponent} from "./coach-details.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CoachDetailsComponent }
    ])],
    exports: [RouterModule]
})
export class CoachDetailsRoutingModule { }
