import { Component, OnInit } from '@angular/core';
import { TipoSintoma } from 'src/app/shared/models/tipoSintoma';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { TipoSintomaService } from "./tipo-sintoma.service";
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-tipo-sintoma',
  templateUrl: './tipo-sintoma.page.html',
  styleUrls: ['./tipo-sintoma.page.scss'],
})
export class TipoSintomaPage implements OnInit {
  tiposintomas: TipoSintoma[] = new Array<TipoSintoma>();
  tiposintomaAux: TipoSintoma[];
  tipoSintomaForm: FormGroup; 
  tipoSintoma: TipoSintoma = new TipoSintoma();
  show: boolean =false;
  modify: boolean = false;
  constructor(private tipoSintomaSvc: TipoSintomaService, private storage: Storage) { }

  async ngOnInit() {
    try {
      this.limpiar();
      await this.tipoSintomaSvc.getTipoSintomas().subscribe(res => {
        if (res.length === 0) {
          this.storage.get('tiposSintomas').then((array) => { this.tiposintomas = array })
        } else {
          this.tiposintomas = res; 
        }
        this.tiposintomaAux = this.tiposintomas;
      });
    } catch (error) {
      console.log('error');
    }
  }

  limpiar(){
    this.tipoSintomaForm= new FormGroup({
      NombreTipoSintoma: new FormControl('',[Validators.maxLength(250), Validators.required]),
    })
    this.modify = false;
    this.tipoSintoma = new TipoSintoma();
  }

  add(){
    this.limpiar();
    this.show = !this.show;
  }

  mod(row){
    this.show = true;
    this.modify = true;
    this.tipoSintoma = row;
    this.tipoSintomaForm.setValue({ NombreTipoSintoma: row.NombreTipoSintoma});
  }
  // llamadas al servicio
  addTipoSintoma(){    
    this.tipoSintomaSvc.addTipoSintoma(this.tipoSintomaForm.value);
    this.limpiar();    
    this.show = false;
  }
  updateTipoSintoma(){
    this.tipoSintoma.NombreTipoSintoma = this.tipoSintomaForm.value.NombreTipoSintoma;   
    this.tipoSintomaSvc.updateTipoSintoma(this.tipoSintoma, this.tipoSintoma.id);
    this.limpiar();    
    this.show = false;
  }
  del(row){
    this.tipoSintomaSvc.removeTipoSintoma(row.id);
  }
  filtrar(event){
    if(this.tiposintomaAux.length>0){
      let val = event.target.value.toLowerCase();
      let keys = Object.keys(this.tiposintomaAux[0]);
      let data = this.tiposintomaAux;
      this.tiposintomas = this.tiposintomaAux.filter(item => {        
            return (item.NombreTipoSintoma? item.NombreTipoSintoma.toString().toLowerCase().indexOf(val) !== -1 : false) 
          });
      this.tiposintomaAux = data;
    }
  }

}
