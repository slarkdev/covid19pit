import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramaSocialPage } from './programa-social.page';

const routes: Routes = [
  {
    path: '',
    component: ProgramaSocialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramaSocialPageRoutingModule {}
