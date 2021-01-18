import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TriajePageRoutingModule } from './triaje-routing.module';
import { TriajePage } from './triaje.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TriajePageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [TriajePage]
})
export class TriajePageModule {}
