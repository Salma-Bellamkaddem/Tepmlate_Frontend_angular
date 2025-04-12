import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportFieldUpdateComponent } from './sportField-update.component';
import { SportFieldUpdateRoutingModule } from './sportField-update-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    CommonModule,
    SportFieldUpdateRoutingModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    DropdownModule,
    FileUploadModule,
    InputTextareaModule,
    InputGroupAddonModule,
    InputGroupModule,
    TableModule,
    ReactiveFormsModule,
    DialogModule,
      PaginatorModule,
      ToastModule
  ],
  declarations: [SportFieldUpdateComponent]
})
export class SportFieldUpdateModule { }
