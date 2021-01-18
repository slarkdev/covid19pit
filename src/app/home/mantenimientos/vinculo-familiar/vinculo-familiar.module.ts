import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VinculoFamiliarPageRoutingModule } from './vinculo-familiar-routing.module';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { VinculoFamiliarPage } from './vinculo-familiar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VinculoFamiliarPageRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ],
  declarations: [VinculoFamiliarPage]
})
export class VinculoFamiliarPageModule {}
