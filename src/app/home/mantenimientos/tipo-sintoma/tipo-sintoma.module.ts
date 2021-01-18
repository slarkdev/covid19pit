import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TipoSintomaPageRoutingModule } from './tipo-sintoma-routing.module';

import { TipoSintomaPage } from './tipo-sintoma.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TipoSintomaPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [TipoSintomaPage]
})
export class TipoSintomaPageModule {}
