import { Component, OnInit } from '@angular/core';
import data from "../../../assets/personas.json";
import { Persona } from 'src/app/shared/models/persona';
import { PersonaService } from '../familia/persona/persona.service';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.page.html',
  styleUrls: ['./paciente.page.scss'],
})
export class PacientePage implements OnInit {

  pacientes = JSON.parse(JSON.stringify(data));
  arreglo = this.pacientes.personas;
  arregloAux = this.arreglo;

  personas: Persona[] = new Array<Persona>();
  personaAux: Persona[];
  constructor(private personaSvc: PersonaService,
    private storage: Storage) { }

  ngOnInit() {
    this.listarPersonas();
  }
  listarPersonas(){
    this.personaSvc.getPersonas().subscribe( res => {
      if(res.length === 0){
        this.storage.get('personas').then( (array) => {
          this.personas = array;
        })
      } else {
        this.personas = res;
      }
      this.personaAux =this.personas;
    })
  }

  filtrar(event){
    if(this.arreglo.length>0){
      let val = event.target.value.toLowerCase();
      let data = this.arregloAux;
      this.arreglo = this.arregloAux.filter(item => {        
            return (item.DNI? item.DNI.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.Nombres? item.Nombres.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.ApellidoPaterno? item.ApellidoPaterno.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.ApellidoMaterno? item.ApellidoMaterno.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.Comunidad? item.Comunidad.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.Distrito? item.Distrito.toString().toLowerCase().indexOf(val) !== -1 : false) ||(item.ProgramaSocial? item.ProgramaSocial.toString().toLowerCase().indexOf(val) !== -1 : false)
          }
        );
      this.arregloAux = data;
    }
  }
  filtrarPacientesAplicativo(event){
    if (this.personaAux.length > 0) {
      let val = event.target.value.toLowerCase();
      let data = this.personaAux;
      this.personas = this.personaAux.filter(item => {
        return (item.DNI? item.DNI.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.Nombres? item.Nombres.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.ApellidoPaterno? item.ApellidoPaterno.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.ApellidoMaterno? item.ApellidoMaterno.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.CentroPoblado? item.CentroPoblado.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.Distrito? item.Distrito.toString().toLowerCase().indexOf(val) !== -1 : false) ||(item.ProgramaSocial? item.ProgramaSocial.toString().toLowerCase().indexOf(val) !== -1 : false)
      }
      );
      this.personaAux = data;
    }
  }

  refresh(){
    this.listarPersonas();
  }

}
