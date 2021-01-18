import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoSintomaPage } from './tipo-sintoma.page';

const routes: Routes = [
  {
    path: '',
    component: TipoSintomaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TipoSintomaPageRoutingModule {}
