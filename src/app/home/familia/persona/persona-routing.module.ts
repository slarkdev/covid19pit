import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonaPage } from './persona.page';
// import { CanEncuestadorGuard } from '../../../auth/guards/can-encuestador.guard';
import { CanAllGuard } from '../../../auth/guards/can-all.guard';
const routes: Routes = [
  {
    path: '',
    component: PersonaPage
  },
  {
    //modifica los datos de una persona
    path: 'persona/:idPersona',
    loadChildren: () => import('./detalle/detalle.module').then( m => m.DetallePageModule),
    canActivate: [CanAllGuard ]
  },
  
  {
    //recupera todos los triajes de una persona
    path: 'triajes/:idPersona',
    loadChildren: () => import('./triaje/triaje.module').then( m => m.TriajePageModule),
    canActivate: [CanAllGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonaPageRoutingModule {}
