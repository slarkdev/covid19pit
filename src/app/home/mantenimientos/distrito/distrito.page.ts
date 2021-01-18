import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Distrito } from 'src/app/shared/models/distrito';
import { DistritoService } from './distrito.service';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-distrito',
  templateUrl: './distrito.page.html',
  styleUrls: ['./distrito.page.scss'],
})
export class DistritoPage implements OnInit {
  distritos: Distrito[] = new Array<Distrito>();
  distritosAux: Distrito[];
  distritoForm: FormGroup; 
  distrito: Distrito = new Distrito();
  show: boolean =false;
  modify: boolean = false;
  constructor(private distritoSvc: DistritoService, private storage: Storage) { }

  async ngOnInit() {
    try {
      this.limpiar();
      await this.distritoSvc.getDistritos().subscribe(res => {
        if (res.length === 0) {
          this.storage.get('distritos').then((array) => { this.distritos = array })
        } else {
          this.distritos = res;
        }
        this.distritosAux = this.distritos;
      });
    } catch (error) {
      console.log('error');
    }
  }

  
  limpiar(){
    this.distritoForm= new FormGroup({
      NombreDistrito: new FormControl('',[Validators.maxLength(50), Validators.required]),
    })
    this.modify = false;
    this.distrito = new Distrito();
  }

  add(){
    this.limpiar();
    this.show = !this.show;
  }

  mod(row){
    this.show = true;
    this.modify = true;
    this.distrito = row;
    this.distritoForm.setValue({ NombreDistrito: row.NombreDistrito });
  }

  // llamadas al servicio
  addDistrito(){
    this.distritoSvc.addDistrito(this.distritoForm.value);
    this.limpiar();    
    this.show = false;
  }
  updateDistrito(){
    this.distrito.NombreDistrito = this.distritoForm.value.NombreDistrito;    
    this.distritoSvc.updateDistrito(this.distrito, this.distrito.id);
    this.limpiar();    
    this.show = false;
  }
  delDistrito(row){
    this.distritoSvc.removeDistrito(row.id);
  }
  filtrar(event){
    if(this.distritosAux.length>0){
      let val = event.target.value.toLowerCase();
      let keys = Object.keys(this.distritosAux[0]);
      let data = this.distritosAux;
      this.distritos = this.distritosAux.filter(item => {        
            return (item.NombreDistrito? item.NombreDistrito.toString().toLowerCase().indexOf(val) !== -1 : false)
          }
        );
      this.distritosAux = data;
    }
  }

}
