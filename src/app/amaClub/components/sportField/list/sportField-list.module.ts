import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportFieldListComponent } from './sportField-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Button, ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { SportFieldListRoutingModule } from './sportField-list.routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SportFieldListRoutingModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    DropdownModule,
    FileUploadModule,
    InputTextareaModule,
    InputGroupModule,
    InputGroupAddonModule,
    TableModule,
    ReactiveFormsModule,
    DialogModule,
    PaginatorModule,
    ToastModule
    
  ],
  declarations: [SportFieldListComponent]
})
export class SportFieldListModule { }
