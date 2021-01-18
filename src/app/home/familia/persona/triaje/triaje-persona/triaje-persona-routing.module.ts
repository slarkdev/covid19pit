import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TriajePersonaPage } from './triaje-persona.page';

const routes: Routes = [
  {
    path: '',
    component: TriajePersonaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TriajePersonaPageRoutingModule {}
