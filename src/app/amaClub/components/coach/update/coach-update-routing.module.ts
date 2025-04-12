import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {CoachUpdateComponent} from "./coach-update.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CoachUpdateComponent }
    ])],
    exports: [RouterModule]
})
export class CoachUpdateRoutingModule { }
