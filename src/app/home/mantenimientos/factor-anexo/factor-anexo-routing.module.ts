import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FactorAnexoPage } from './factor-anexo.page';

const routes: Routes = [
  {
    path: '',
    component: FactorAnexoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FactorAnexoPageRoutingModule {}
