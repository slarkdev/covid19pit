import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FactorAnexoPageRoutingModule } from './factor-anexo-routing.module';

import { FactorAnexoPage } from './factor-anexo.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FactorAnexoPageRoutingModule,
    NgxDatatableModule,
    ReactiveFormsModule
  ],
  declarations: [FactorAnexoPage]
})
export class FactorAnexoPageModule {}
