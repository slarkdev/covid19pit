import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Persona } from 'src/app/shared/models/persona';
import { PersonaService } from '../persona.service';

import { TriajeService } from './triaje.service';
import { TriajePersona } from 'src/app/shared/models/triajePersona.interface';
import Swal from 'sweetalert2';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-triaje',
  templateUrl: './triaje.page.html',
  styleUrls: ['./triaje.page.scss'],
})
export class TriajePage implements OnInit {
  idFamilia: string;
  idPersona: string;
  persona: Persona = new Persona();
  triajes: TriajePersona[] = new Array<TriajePersona>();
  triajeAux: TriajePersona[];

  showDatos: boolean = false;

  constructor(private personaSvc: PersonaService,
    private triajeSvc: TriajeService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage
  ) {
    this.idFamilia = this.route.snapshot.params.idFamilia;
    this.idPersona = this.route.snapshot.params.idPersona;
  }

  ngOnInit() {
    this.listarTriajes();
  }
  async listarTriajes(){
    try {

      await this.personaSvc.getPersona(this.idPersona).subscribe(res => {
        if (!res) {
          this.storage.get('personas').then(array => {
            if (array) { this.persona = array.filter(i => { return i.idPersona === this.idPersona }) }
          });
        } else {
          this.persona = res;
        }
      });

      await this.triajeSvc.getTriajesPersona(this.idPersona).subscribe(res => {
        if (res.length === 0) {

          this.storage.get('triajesPersona').then((array) => { if (array) { this.triajes = array.filter(i => { return i.idPersona === this.idPersona }) } })
          // this.triajeSvc.actualizarStorage();
          
        } else {
          this.triajes = res;
        }
        this.triajeAux = this.triajes;
      });

    } catch (error) {
      console.log('error', error);
    }
  }
  refresh(){
    this.listarTriajes();
  }
  see(row) {
    this.router.navigate(['home/familia/' + this.idFamilia + '/triajes/' + this.idPersona + '/triaje/' + row.id + '/see']);
  }

  add() {
    this.router.navigate(['home/familia/' + this.idFamilia + '/triajes/' + this.idPersona + '/triaje/add/add']);
  }

  mod(row) {
    this.router.navigate(['home/familia/' + this.idFamilia + '/triajes/' + this.idPersona + '/triaje/' + row.id + '/mod']);
  }
  del(row) {
    Swal.fire({
      icon: 'question',
      title: 'Mensaje de confirmación',
      text: '¿Esta seguro de eliminar este registro?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'No'
    }).then(res => {
      if (res.value) {
        row.Estado = false;
        this.triajeSvc.updateTriaje(row, row.id);
        // this.triajeSvc.removeTriaje(row.id);
      }
    });
  }

  filtrar(event) {
    if (this.triajeAux.length > 0) {
      let val = event.target.value.toLowerCase();
      let data = this.triajeAux;
      this.triajes = this.triajeAux.filter(item => {
        return (item.Fecha ? item.Fecha.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.Entrevistador ? item.Entrevistador.toString().toLowerCase().indexOf(val) !== -1 : false)
      }
      );
      this.triajeAux = data;
    }
  }
  volverPersonas() {
    this.router.navigate(["home/familia/" + this.idFamilia]);
  }

}
