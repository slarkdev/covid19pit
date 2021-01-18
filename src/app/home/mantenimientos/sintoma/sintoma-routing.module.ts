import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SintomaPage } from './sintoma.page';

const routes: Routes = [
  {
    path: '',
    component: SintomaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SintomaPageRoutingModule {}
