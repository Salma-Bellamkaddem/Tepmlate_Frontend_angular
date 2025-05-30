import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCooperativeComponent } from './create-cooperative.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule
  ],
  declarations: [CreateCooperativeComponent]
})
export class CreateCooperativeModule { }
