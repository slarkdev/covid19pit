import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConsolidadoPageRoutingModule } from './consolidado-routing.module';
import { ConsolidadoPage } from './consolidado.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsolidadoPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [ConsolidadoPage]
})
export class ConsolidadoPageModule {}
