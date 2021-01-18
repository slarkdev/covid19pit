import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgramaSocialPageRoutingModule } from './programa-social-routing.module';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProgramaSocialPage } from './programa-social.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramaSocialPageRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ],
  declarations: [ProgramaSocialPage]
})
export class ProgramaSocialPageModule {}
