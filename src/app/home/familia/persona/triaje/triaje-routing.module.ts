import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TriajePage } from './triaje.page';

const routes: Routes = [
  {
    path: '',
    component: TriajePage
  },
  {
    //ver el triaje para una persona
    path: 'triaje/:idTriaje/:idOpcion',
    loadChildren: () => import('./triaje-persona/triaje-persona.module').then(m => m.TriajePersonaPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TriajePageRoutingModule {}
