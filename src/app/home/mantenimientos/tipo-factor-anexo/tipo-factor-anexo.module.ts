import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TipoFactorAnexoPageRoutingModule } from './tipo-factor-anexo-routing.module';

import { TipoFactorAnexoPage } from './tipo-factor-anexo.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TipoFactorAnexoPageRoutingModule,
    NgxDatatableModule,
    ReactiveFormsModule
  ],
  declarations: [TipoFactorAnexoPage]
})
export class TipoFactorAnexoPageModule {}
