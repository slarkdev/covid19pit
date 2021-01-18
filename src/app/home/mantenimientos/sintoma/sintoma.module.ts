import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SintomaPageRoutingModule } from './sintoma-routing.module';
import { SintomaPage } from './sintoma.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SintomaPageRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ],
  declarations: [SintomaPage]
})
export class SintomaPageModule {}
