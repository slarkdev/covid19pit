import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FamiliaPageRoutingModule } from './familia-routing.module';
import { FamiliaPage } from './familia.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FamiliaPageRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ],
  declarations: [FamiliaPage]
})
export class FamiliaPageModule {}
