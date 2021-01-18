import { Component, OnInit } from '@angular/core';
import { ProgramaSocial } from 'src/app/shared/models/programaSocial';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProgramaSocialService } from './programaSocial.service';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-programa-social',
  templateUrl: './programa-social.page.html',
  styleUrls: ['./programa-social.page.scss'],
})
export class ProgramaSocialPage implements OnInit {
  programasSociales: ProgramaSocial[] = new Array<ProgramaSocial>();
  psAux: ProgramaSocial[];
  psForm: FormGroup; 
  ps: ProgramaSocial = new ProgramaSocial();
  show: boolean =false;
  modify: boolean = false;
  constructor(private psSvc: ProgramaSocialService, private storage: Storage) { }

  async ngOnInit() {
    try {
      this.limpiar();
      await this.psSvc.getProgramasSociales().subscribe(res => {
        if (res.length === 0) {
          this.storage.get('programasSociales').then((array) => { this.programasSociales = array })
        } else {
          this.programasSociales = res; 
        }        
        this.psAux = this.programasSociales;        
      });
    } catch (error) {
      console.log('error');
    }
  }

  
  limpiar(){
    this.psForm= new FormGroup({
      NombreProgramaSocial: new FormControl('',[Validators.maxLength(50), Validators.required]),
    })
    this.modify = false;
    this.ps = new ProgramaSocial();
  }

  add(){
    this.limpiar();
    this.show = !this.show;
  }

  mod(row){
    this.show = true;
    this.modify = true;
    this.ps = row;
    this.psForm.setValue({ NombreProgramaSocial: row.NombreProgramaSocial });
  }

  // llamadas al servicio
  addPS(){
    this.psSvc.addPS(this.psForm.value);
    this.limpiar();    
    this.show = false;
  }
  updatePS(){
    this.ps.NombreProgramaSocial = this.psForm.value.NombreProgramaSocial;    
    this.psSvc.updatePS(this.ps, this.ps.id);
    this.limpiar();    
    this.show = false;
  }
  delPS(row){    
    this.psSvc.removePS(row.id);
  }
  filtrar(event){
    if(this.psAux.length>0){
      let val = event.target.value.toLowerCase();
      let keys = Object.keys(this.psAux[0]);
      let data = this.psAux;
      this.programasSociales = this.psAux.filter(item => {        
            return (item.NombreProgramaSocial? item.NombreProgramaSocial.toString().toLowerCase().indexOf(val) !== -1 : false)
          }
        );
      this.psAux = data;
    }
  }


}
