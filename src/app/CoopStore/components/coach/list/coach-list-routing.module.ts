import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {CoachListComponent} from "./coach-list.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CoachListComponent }
    ])],
    exports: [RouterModule]
})
export class CoachListRoutingModule { }
