import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { TipoFactorAnexo } from 'src/app/shared/models/tipoFactorAnexo';
import { TipoFactorAnexoService } from './tipo-factor-anexo.service'
@Component({
  selector: 'app-tipo-factor-anexo',
  templateUrl: './tipo-factor-anexo.page.html',
  styleUrls: ['./tipo-factor-anexo.page.scss'],
})
export class TipoFactorAnexoPage implements OnInit {
  
  tiposFA: TipoFactorAnexo[] = new Array<TipoFactorAnexo>();
  tiposFAAux: TipoFactorAnexo[];
  tipoFAForm: FormGroup; 
  tipoFA: TipoFactorAnexo = new TipoFactorAnexo();
  show: boolean =false;
  modify: boolean = false;

  constructor(private tipoFASvc: TipoFactorAnexoService) { }

  async ngOnInit() {
    try {
      this.limpiar();
      await this.tipoFASvc.getTipoFactoresAnexo().subscribe(res => {
        this.tiposFA = res; 
        this.tiposFAAux = this.tiposFA;
      });
    } catch (error) {
      console.log('error');
    }
  }

  limpiar(){
    this.tipoFAForm= new FormGroup({
      NombreTipoFactorAnexo: new FormControl('',[Validators.maxLength(250), Validators.required]),
    })
    this.modify = false;
    this.tipoFA = new TipoFactorAnexo();
  }

  add(){
    this.limpiar();
    this.show = !this.show;
  }

  mod(row){
    this.show = true;
    this.modify = true;
    this.tipoFA = row;
    this.tipoFAForm.setValue({ NombreTipoFactorAnexo: row.NombreTipoFactorAnexo});
  }
  // llamadas al servicio
  addTipoFA(){    
    this.tipoFASvc.addTipoFactorAnexo(this.tipoFAForm.value);
    this.limpiar();    
    this.show = false;
  }
  updateTipoFA(){
    this.tipoFA.NombreTipoFactorAnexo = this.tipoFAForm.value.NombreTipoFactorAnexo;   
    this.tipoFASvc.updateTipoFactorAnexo(this.tipoFA, this.tipoFA.id);
    this.limpiar();    
    this.show = false;
  }
  del(row){
    this.tipoFASvc.removeTipoFactorAnexo(row.id);
  }
  filtrar(event){
    if(this.tiposFAAux.length>0){
      let val = event.target.value.toLowerCase();
      let keys = Object.keys(this.tiposFAAux[0]);
      let data = this.tiposFAAux;
      this.tiposFA = this.tiposFAAux.filter(item => {        
            return (item.NombreTipoFactorAnexo? item.NombreTipoFactorAnexo.toString().toLowerCase().indexOf(val) !== -1 : false) 
          });
      this.tiposFAAux = data;
    }
  }

}
