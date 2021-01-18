import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FactorAnexo } from 'src/app/shared/models/factorAnexo';
import { FactorAnexoService } from './factor-anexo.service';
import { TipoFactorAnexoService } from '../tipo-factor-anexo/tipo-factor-anexo.service';
import { TipoFactorAnexo } from 'src/app/shared/models/tipoFactorAnexo';
@Component({
  selector: 'app-factor-anexo',
  templateUrl: './factor-anexo.page.html',
  styleUrls: ['./factor-anexo.page.scss'],
})
export class FactorAnexoPage implements OnInit {

  factoresAnexo: FactorAnexo[] = new Array<FactorAnexo>();
  factoresAnexoAux: FactorAnexo[];
  faForm: FormGroup;
  fa: FactorAnexo = new FactorAnexo();
  show: boolean = false;
  modify: boolean = false;

  tiposFA: TipoFactorAnexo[] = new Array<TipoFactorAnexo>();

  constructor(private faSvc: FactorAnexoService,
    private tipoFASvc: TipoFactorAnexoService) { }

    async ngOnInit() {
      try {
        this.limpiar();
        await this.tipoFASvc.getTipoFactoresAnexo().subscribe(res => { this.tiposFA = res;        
         });
  
        await this.faSvc.getFactoresAnexo().subscribe(res => {
          this.factoresAnexo = res;
          this.factoresAnexoAux = this.factoresAnexo;
        });
      } catch (error) {
        console.log('error');
      }
    }
  
  
    limpiar() {
      this.faForm = new FormGroup({
        NombreFactorAnexo: new FormControl('', [Validators.maxLength(250), Validators.required]),
        TipoFactorAnexo: new FormControl('', Validators.required),
        Puntos: new FormControl('', Validators.required)
      })
      this.modify = false;
      this.fa = new FactorAnexo();
    }
  
    add() {
      this.limpiar();
      this.show = !this.show;
    }
  
    mod(row) {
      this.show = true;
      this.modify = true;
      this.fa = row;
      this.faForm.setValue({
        NombreFactorAnexo: row.NombreFactorAnexo,
        TipoFactorAnexo: row.TipoFactorAnexo ? row.TipoFactorAnexo : '',
        Puntos: row.Puntos? row.Puntos : 0,
      });
    }
    // llamadas al servicio
    addFA() {
      this.faSvc.addFactorAnexo(this.faForm.value);
      this.limpiar();
      this.show = false;
    }
    updateFA() {
      this.fa.NombreFactorAnexo = this.faForm.value.NombreFactorAnexo;
      this.fa.TipoFactorAnexo = this.faForm.value.TipoFactorAnexo;
      this.fa.Puntos = this.faForm.value.Puntos;
      this.faSvc.updateFactorAnexo(this.fa, this.fa.id);
      this.limpiar();
      this.show = false;
    }
    del(row) {
      this.faSvc.removeFactorAnexo(row.id);
    }
    filtrar(event) {
      if (this.factoresAnexoAux.length > 0) {
        let val = event.target.value.toLowerCase();
        let keys = Object.keys(this.factoresAnexoAux[0]);
        let data = this.factoresAnexoAux;
        this.factoresAnexo = this.factoresAnexoAux.filter(item => {
          return (item.NombreFactorAnexo ? item.NombreFactorAnexo.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.TipoFactorAnexo ? item.TipoFactorAnexo.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.Puntos ? item.Puntos.toString().toLowerCase().indexOf(val) !== -1 : false)
        }
        );
        this.factoresAnexoAux = data;
      }
    }
}
