import { Injectable } from '@angular/core';

import { SintomaService } from 'src/app/home/mantenimientos/sintoma/sintoma.service';
import { DistritoService } from 'src/app/home//mantenimientos/distrito/distrito.service';
import { TipoSintomaService } from 'src/app/home//mantenimientos/tipo-sintoma/tipo-sintoma.service';
import { CentroPobladoService } from 'src/app/home//mantenimientos/comunidad/comunidad.service';
import { VinculoFamiliarService } from 'src/app/home//mantenimientos/vinculo-familiar/vinculo-familiar.service';
import { ProgramaSocialService } from 'src/app/home//mantenimientos/programa-social/programaSocial.service';
import { PersonaService } from 'src/app/home/familia/persona/persona.service';
import { FamiliaService } from 'src/app/home/familia/familia.service';
import { CentroPoblado } from 'src/app/shared/models/comunidad';
import { Sintoma } from 'src/app/shared/models/sintoma';
import { TipoSintoma } from 'src/app/shared/models/tipoSintoma';
import { Distrito } from 'src/app/shared/models/distrito';
import { VinculoFamiliar } from 'src/app/shared/models/vinculoFamiliar';
import { ProgramaSocial } from 'src/app/shared/models/programaSocial';
import { Familia } from 'src/app/shared/models/familia';
import { Persona } from 'src/app/shared/models/persona';
import { TriajePersona } from 'src/app/shared/models/triajePersona.interface';
import { TriajeService } from 'src/app/home/familia/persona/triaje/triaje.service';

import { Storage } from '@ionic/storage';
import Swal from 'sweetalert2';
@Injectable({
    providedIn: 'root'
})
export class BDService {

    sintomas: Sintoma[] = new Array<Sintoma>();
    tiposSintomas: TipoSintoma[] = new Array<TipoSintoma>();
    centrosPoblados: CentroPoblado[] = new Array<CentroPoblado>();
    distritos: Distrito[] = new Array<Distrito>();
    vfs: VinculoFamiliar[] = new Array<VinculoFamiliar>();
    pss: ProgramaSocial[] = new Array<ProgramaSocial>();
    personas: Persona[] = new Array<Persona>();
    familias: Familia[] = new Array<Familia>();
  
    triajes: TriajePersona[] = new Array<TriajePersona>();

    constructor(
        private sintomasSvc: SintomaService,
        private tipoSintomaSvc: TipoSintomaService,
        private centroPobladoSvc: CentroPobladoService,
        private distritosSvc: DistritoService,
        private vinculoFamiliarSvc: VinculoFamiliarService,
        private programaSocialSvc: ProgramaSocialService,
        private personaSvc: PersonaService,
        private familiaSvc: FamiliaService,
        private triajePersonaSvc: TriajeService,
        private storage: Storage
    ) { }
    async descargarBD() {
        await this.sintomasSvc.getSintomas().subscribe(res => {
            this.sintomas = res;
            this.storage.set('sintomas', this.sintomas);
        });

        await this.tipoSintomaSvc.getTipoSintomas().subscribe(res => {
            this.tiposSintomas = res;
            this.storage.set('tiposSintomas', this.tiposSintomas);
        });

        await this.centroPobladoSvc.getComunidades().subscribe(res => {
            this.centrosPoblados = res;
            this.storage.set('centrosPoblados', this.centrosPoblados);
        });

        await this.distritosSvc.getDistritos().subscribe(res => {
            this.distritos = res;
            this.storage.set('distritos', this.distritos);
        });

        await this.programaSocialSvc.getProgramasSociales().subscribe(res => {
            this.pss = res;
            this.storage.set('programasSociales', this.pss);
        });

        await this.vinculoFamiliarSvc.getVinculosFamiliares().subscribe(res => {
            this.vfs = res;
            this.storage.set('vinculosFamiliares', this.vfs);
        });

        await this.familiaSvc.getFamilias().subscribe(res => {
            this.familias = res;
            this.storage.set('familias', this.familias);
        });

        await this.personaSvc.getPersonas().subscribe(res => {
            this.personas = res;
            this.storage.set('personas', this.personas);
        });

        await this.triajePersonaSvc.getTriajes().subscribe(res => {
            this.triajes = res;
            this.storage.set('triajesPersona', this.triajes);
        });
    }
}