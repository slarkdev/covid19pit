import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetallePageRoutingModule } from './detalle-routing.module';
import { DetallePage } from './detalle.page';
import { ViviendaPage } from '../vivienda/vivienda.page';
import { SocioeconomicasPage } from '../socioeconomicas/socioeconomicas.page';
import { SaludPage } from '../salud/salud.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DetallePageRoutingModule
  ],
  declarations: [DetallePage, ViviendaPage,SocioeconomicasPage, SaludPage],
})
export class DetallePageModule {}
