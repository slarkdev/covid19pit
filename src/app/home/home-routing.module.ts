import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { CanEncuestadorGuard } from '../auth/guards/can-encuestador.guard';
import { CanAdminGuard } from '../auth/guards/can-admin.guard';
import { CanAllGuard } from '../auth/guards/can-all.guard';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: HomePage,
    canActivate: [CanAllGuard],
    children: [
      {
        path: 'sintoma',
        loadChildren: () => import('./mantenimientos/sintoma/sintoma.module').then(m => m.SintomaPageModule),
        canActivate: [CanAdminGuard]
      },
      {
        path: 'tipo-sintoma',
        loadChildren: () => import('./mantenimientos/tipo-sintoma/tipo-sintoma.module').then( m => m.TipoSintomaPageModule),
        canActivate: [CanAdminGuard]
      },
      {
        path: 'centro-poblado',
        loadChildren: () => import('./mantenimientos/comunidad/comunidad.module').then(m => m.ComunidadPageModule),
        canActivate: [CanAdminGuard]
      },
      {
        path: 'programa-social',
        loadChildren: () => import('./mantenimientos/programa-social/programa-social.module').then(m => m.ProgramaSocialPageModule),
        canActivate: [CanAdminGuard]
      },
      {
        path: 'vinculo-familiar',
        loadChildren: () => import('./mantenimientos/vinculo-familiar/vinculo-familiar.module').then(m => m.VinculoFamiliarPageModule),
        canActivate: [CanAdminGuard]
      },
      {
        path: 'distrito',
        loadChildren: () => import('./mantenimientos/distrito/distrito.module').then(m => m.DistritoPageModule),
        canActivate: [CanAdminGuard]
      },
      {
        path: 'factor-anexo',
        loadChildren: () => import('./mantenimientos/factor-anexo/factor-anexo.module').then( m => m.FactorAnexoPageModule),
        canActivate: [CanAdminGuard]
      },
      {
        path: 'tipo-factor-anexo',
        loadChildren: () => import('./mantenimientos/tipo-factor-anexo/tipo-factor-anexo.module').then( m => m.TipoFactorAnexoPageModule),
        canActivate: [CanAdminGuard]
      },
      {
        path: 'familia',
        loadChildren: () => import('./familia/familia.module').then(m => m.FamiliaPageModule),
        canActivate: [CanAllGuard],
        
      },
      {
        path: 'familia/:idFamilia',
        loadChildren: () => import('./familia/persona/persona.module').then( m => m.PersonaPageModule),
        canActivate: [CanAllGuard],
      },
      {
        path: 'paciente',
        loadChildren: () => import('./paciente/paciente.module').then( m => m.PacientePageModule),
        canActivate: [CanAllGuard]
      },
      {
        path: '**',
        loadChildren: () => import('./not-found/not-found.module').then( m => m.NotFoundPageModule),
        canActivate: [CanAllGuard]
        // eliminar solo cambia el estado de 1 a 0
      },
    ]
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
