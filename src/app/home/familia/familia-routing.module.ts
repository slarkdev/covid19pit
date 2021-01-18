import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FamiliaPage } from './familia.page';
// import { CanEncuestadorGuard } from '../../auth/guards/can-encuestador.guard';
import { CanAllGuard } from '../../auth/guards/can-all.guard';
const routes: Routes = [
  {
    path: '',
    component: FamiliaPage,
  },
  {
    path: 'consolidado/:idFamilia',
    loadChildren: () => import('./consolidado/consolidado.module').then(m => m.ConsolidadoPageModule),
    canActivate: [CanAllGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamiliaPageRoutingModule { }
