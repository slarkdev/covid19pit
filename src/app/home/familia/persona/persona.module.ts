import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PersonaPageRoutingModule } from './persona-routing.module';
import { PersonaPage } from './persona.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PersonaPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [PersonaPage]
})
export class PersonaPageModule {}
