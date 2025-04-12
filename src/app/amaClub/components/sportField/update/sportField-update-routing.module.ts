import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SportFieldUpdateComponent } from './sportField-update.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SportFieldUpdateComponent }
    ])],
    exports: [RouterModule]
})
export class SportFieldUpdateRoutingModule { }
