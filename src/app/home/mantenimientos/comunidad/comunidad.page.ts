import { Component, OnInit } from '@angular/core';
import { CentroPoblado } from 'src/app/shared/models/comunidad';
import { CentroPobladoService } from './comunidad.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.page.html',
  styleUrls: ['./comunidad.page.scss'],
})
export class ComunidadPage implements OnInit {
  comunidades: CentroPoblado[] = new Array<CentroPoblado>();
  comunidadesAux: CentroPoblado[];
  comunidadForm: FormGroup; 
  comunidad: CentroPoblado = new CentroPoblado();
  show: boolean =false;
  modify: boolean = false;
  constructor(private comunidadSvc: CentroPobladoService,
    private storage: Storage
    ) { }

  async ngOnInit() {
    try {
      this.limpiar();
      await this.comunidadSvc.getComunidades().subscribe(res => {
        if (res.length === 0) {
          this.storage.get('centrosPoblados').then((array) => { this.comunidades = array })
        } else {
          this.comunidades = res;
        }
        this.comunidadesAux = this.comunidades;
      });
    } catch (error) {
      console.log('error');
    }
  }

  limpiar(){
    this.comunidadForm= new FormGroup({
      NombreCentroPoblado: new FormControl('',[Validators.maxLength(50), Validators.required]),
    })
    this.modify = false;
    this.comunidad = new CentroPoblado();
  }

  add(){
    this.limpiar();
    this.show = !this.show;
  }

  mod(row){
    this.show = true;
    this.modify = true;
    this.comunidad = row;
    this.comunidadForm.setValue({ NombreCentroPoblado: row.NombreCentroPoblado });
  }

  // llamadas al servicio
  addComunidad(){
    this.comunidadSvc.addComunidad(this.comunidadForm.value);
    this.limpiar();    
    this.show = false;
  }
  updateComunidad(){
    this.comunidad.NombreCentroPoblado = this.comunidadForm.value.NombreCentroPoblado;    
    this.comunidadSvc.updateComunidad(this.comunidad, this.comunidad.id);
    this.limpiar();    
    this.show = false;
  }
  delComunidad(row){
    this.comunidadSvc.removeComunidad(row.id);
  }
  filtrar(event){
    if(this.comunidadesAux.length>0){
      let val = event.target.value.toLowerCase();
      let keys = Object.keys(this.comunidadesAux[0]);
      let data = this.comunidadesAux;
      this.comunidades = this.comunidadesAux.filter(item => {        
            return (item.NombreCentroPoblado? item.NombreCentroPoblado.toString().toLowerCase().indexOf(val) !== -1 : false)
          }
        );
      this.comunidadesAux = data;
    }
  }
}
