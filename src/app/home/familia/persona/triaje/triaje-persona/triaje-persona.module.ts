import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TriajePersonaPageRoutingModule } from './triaje-persona-routing.module';

import { TriajePersonaPage } from './triaje-persona.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TriajePersonaPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [TriajePersonaPage],
})
export class TriajePersonaPageModule {}
