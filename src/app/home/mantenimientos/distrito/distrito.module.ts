import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { DistritoPageRoutingModule } from './distrito-routing.module';
import { DistritoPage } from './distrito.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DistritoPageRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ],
  declarations: [DistritoPage]
})
export class DistritoPageModule {}