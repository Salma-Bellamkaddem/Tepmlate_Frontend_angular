import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {CoachCreateComponent} from "./coach-create.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CoachCreateComponent }
    ])],
    exports: [RouterModule]
})
export class CoachCreateRoutingModule { }
