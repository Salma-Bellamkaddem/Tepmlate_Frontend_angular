import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsSportFieldComponent } from './details-sportField.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailsSportFieldRoutingModule } from './details-sportField.routing.module';
import { ButtonModule } from 'primeng/button';
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
import { TabViewModule } from 'primeng/tabview';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DetailsSportFieldRoutingModule,
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
    ToastModule,
    TabViewModule
  ],
  declarations: [DetailsSportFieldComponent]
})
export class DetailsSportFieldModule { }
