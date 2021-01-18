import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VinculoFamiliarPage } from './vinculo-familiar.page';

const routes: Routes = [
  {
    path: '',
    component: VinculoFamiliarPage
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VinculoFamiliarPageRoutingModule {}
