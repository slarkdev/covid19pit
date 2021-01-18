import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoFactorAnexoPage } from './tipo-factor-anexo.page';

const routes: Routes = [
  {
    path: '',
    component: TipoFactorAnexoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TipoFactorAnexoPageRoutingModule {}
