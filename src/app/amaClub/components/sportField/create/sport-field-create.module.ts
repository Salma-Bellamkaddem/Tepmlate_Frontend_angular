import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportFieldCreateRoutingModule } from './sport-field-create-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { CreateSportFieldComponent } from './create-sport-field.component';


@NgModule({
 
  imports: [
    CommonModule,
    SportFieldCreateRoutingModule,
    FormsModule,
    ButtonModule,
    ReactiveFormsModule,
    RippleModule,
    InputTextModule,
    DropdownModule,
    FileUploadModule,
    InputGroupModule,
    InputGroupAddonModule,
    TableModule,
    ReactiveFormsModule,
    DialogModule,
    PaginatorModule,
    ToastModule

  ],
  declarations: [CreateSportFieldComponent]
})
export class SportFieldCreateModule { }
