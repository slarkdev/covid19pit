import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VinculoFamiliar } from 'src/app/shared/models/vinculoFamiliar';
import { VinculoFamiliarService } from './vinculo-familiar.service';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-vinculo-familiar',
  templateUrl: './vinculo-familiar.page.html',
  styleUrls: ['./vinculo-familiar.page.scss'],
})
export class VinculoFamiliarPage implements OnInit {
  vinculosFamiliares: VinculoFamiliar[] = new Array<VinculoFamiliar>();
  vfAux: VinculoFamiliar[];
  vfForm: FormGroup; 
  vf: VinculoFamiliar = new VinculoFamiliar();
  show: boolean =false;
  modify: boolean = false;
  constructor(private vfSvc: VinculoFamiliarService, private storage: Storage) { }

  async ngOnInit() {
    try {
      this.limpiar();
      await this.vfSvc.getVinculosFamiliares().subscribe(res => {
        if (res.length === 0) {
          this.storage.get('vinculosFamiliares').then((array) => { this.vinculosFamiliares = array })
        } else {
          this.vinculosFamiliares = res; 
        }
        this.vfAux = this.vinculosFamiliares;
      });
    } catch (error) {
      console.log('error');
    }
  }

  
  limpiar(){
    this.vfForm= new FormGroup({
      NombreVinculoFamiliar: new FormControl('',[Validators.maxLength(50), Validators.required]),
    })
    this.modify = false;
    this.vf = new VinculoFamiliar();
  }

  add(){
    this.limpiar();
    this.show = !this.show;
  }

  mod(row){
    this.show = true;
    this.modify = true;
    this.vf = row;
    this.vfForm.setValue({ NombreVinculoFamiliar: row.NombreVinculoFamiliar });
  }

  // llamadas al servicio
  addVF(){
    this.vfSvc.addVF(this.vfForm.value);
    this.limpiar();    
    this.show = false;
  }
  updateVF(){
    this.vf.NombreVinculoFamiliar = this.vfForm.value.NombreVinculoFamiliar;    
    this.vfSvc.updateVF(this.vf, this.vf.id);
    this.limpiar();    
    this.show = false;
  }
  delVF(row){
    this.vfSvc.removeVF(row.id);
  }
  filtrar(event){
    if(this.vfAux.length>0){
      let val = event.target.value.toLowerCase();
      let keys = Object.keys(this.vfAux[0]);
      let data = this.vfAux;
      this.vinculosFamiliares = this.vfAux.filter(item => {        
            return (item.NombreVinculoFamiliar? item.NombreVinculoFamiliar.toString().toLowerCase().indexOf(val) !== -1 : false)
          }
        );
      this.vfAux = data;
    }
  }
}
