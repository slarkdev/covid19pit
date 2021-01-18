import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsolidadoPage } from './consolidado.page';

const routes: Routes = [
  {
    path: '',
    component: ConsolidadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsolidadoPageRoutingModule {}
