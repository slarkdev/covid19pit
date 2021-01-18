import { Component, OnInit, ViewChild } from '@angular/core';
import { Persona } from 'src/app/shared/models/persona';
import { FormGroup } from '@angular/forms';
import { PersonaService } from './persona.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FamiliaService } from '../familia.service';
import Swal from 'sweetalert2';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-persona',
  templateUrl: './persona.page.html',
  styleUrls: ['./persona.page.scss'],
})
export class PersonaPage implements OnInit {
  @ViewChild('myTable') table: any;

  idFamilia: string;
  familia: any;
  personas: Persona[] = new Array<Persona>();
  personaAux: Persona[];
  personaForm: FormGroup;
  persona: Persona = new Persona();
  show: boolean = false;
  modify: boolean = false;
  constructor(
    private personaSvc: PersonaService,
    private familiaSvc: FamiliaService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage
  ) {
    this.idFamilia = this.route.snapshot.params.idFamilia;
  }

  async ngOnInit() {
    this.listarPersonas();
  }

  async listarPersonas(){
    try {
      await this.familiaSvc.getFamilia(this.idFamilia).subscribe(res => {
        if (!res) {
          this.storage.get('familias').then(array => {
            if (array) { this.familia = array.filter(i => { return i.idFamilia === this.idFamilia }) }
          });
        } else {
          this.familia = res;
        }
      });

      await this.personaSvc.getPersonasFamilia(this.idFamilia).subscribe(res => {

        if (res.length === 0) {
          this.storage.get('personas').then(array => {
            if (array) {
              this.personas = array.filter(i => { return i.idFamilia === this.idFamilia });
              this.personaSvc.actualizarStorage();
            }
          });
        } else {
          this.personas = res;
        }
        this.personaAux = this.personas;
      });
    } catch (error) {
      console.log('error', error);
    }
  }
  refresh(){
    this.listarPersonas();
  }
  add() {
    let idFamilia = this.route.snapshot.params.idFamilia;
    this.router.navigate(['home/familia/' + idFamilia + '/persona/add']);
  }
  mod(row) {
    this.router.navigate(['home/familia/' + row.idFamilia + '/persona/' + row.id], row);
  }
  volverFamilias() {
    this.router.navigate(["home/familia"]);
  }

  detallePersona(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }
  delPersona(row) {
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
        this.personaSvc.updatePersona(row, row.id);
        // this.personaSvc.removePersona(row.id);
      }
    })
  }
  filtrar(event) {
    if (this.personaAux.length > 0) {
      let val = event.target.value.toLowerCase();
      let data = this.personaAux;
      this.personas = this.personaAux.filter(item => {
        return (item.DNI ? item.DNI.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.ApellidoPaterno ? item.ApellidoPaterno.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.ApellidoMaterno ? item.ApellidoMaterno.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.Nombres ? item.Nombres.toString().toLowerCase().indexOf(val) !== -1 : false)
      }
      );
      this.personaAux = data;
    }
  }
  triaje(row) {
    this.router.navigate(["home/familia/" + this.idFamilia + "/triajes/", row.id]);
  }
}
