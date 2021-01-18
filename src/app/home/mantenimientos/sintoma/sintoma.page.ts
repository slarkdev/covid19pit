import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Sintoma } from 'src/app/shared/models/sintoma';
import { SintomaService } from './sintoma.service';
import { TipoSintomaService } from '../tipo-sintoma/tipo-sintoma.service';
import { TipoSintoma } from 'src/app/shared/models/tipoSintoma';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-sintoma',
  templateUrl: './sintoma.page.html',
  styleUrls: ['./sintoma.page.scss'],
})
export class SintomaPage implements OnInit {
  sintomas: Sintoma[] = new Array<Sintoma>();
  sintomaAux: Sintoma[];
  sintomaForm: FormGroup;
  sintoma: Sintoma = new Sintoma();
  show: boolean = false;
  modify: boolean = false;

  tiposSintoma: TipoSintoma[] = new Array<TipoSintoma>();
  constructor(private sintomaSvc: SintomaService,
    private tipoSintomaSvc: TipoSintomaService,
    private storage: Storage) { }

  async ngOnInit() {
    try {
      this.limpiar();
      await this.tipoSintomaSvc.getTipoSintomas().subscribe(res => {
        if (res.length === 0) {
          this.storage.get('tiposSintomas').then((array) => { this.tiposSintoma = array })
        } else {
          this.tiposSintoma = res;
        }
       });

      await this.sintomaSvc.getSintomas().subscribe(res => {
        if (res.length === 0) {
          this.storage.get('sintomas').then((array) => { this.sintomas = array })
        } else {
          this.sintomas = res; 
        }
        this.sintomaAux = this.sintomas;
      });
    } catch (error) {
      console.log('error');
    }
  }


  limpiar() {
    this.sintomaForm = new FormGroup({
      NombreSintoma: new FormControl('', [Validators.maxLength(250), Validators.required]),
      TipoSintoma: new FormControl('', Validators.required),
      Medida: new FormControl(''),
      Puntos: new FormControl('', Validators.required)
    })
    this.modify = false;
    this.sintoma = new Sintoma();
  }

  add() {
    this.limpiar();
    this.show = !this.show;
  }

  mod(row) {    
    this.show = true;
    this.modify = true;
    this.sintoma = row;
    this.sintomaForm.setValue({
      NombreSintoma: row.NombreSintoma,
      TipoSintoma: row.TipoSintoma ? row.TipoSintoma : '',
      Medida: row.Medida? row.Medida : '',
      Puntos: row.Puntos? row.Puntos : 0,
    });
  }
  // llamadas al servicio
  addSintoma() {
    this.sintomaSvc.addSintoma(this.sintomaForm.value);
    this.limpiar();
    this.show = false;
  }
  updateSintoma() {
    this.sintoma.NombreSintoma = this.sintomaForm.value.NombreSintoma;
    this.sintoma.TipoSintoma = this.sintomaForm.value.TipoSintoma;
    this.sintoma.Medida = this.sintomaForm.value.Medida;
    this.sintoma.Puntos = this.sintomaForm.value.Puntos;
    this.sintomaSvc.updateSintoma(this.sintoma, this.sintoma.id);
    this.limpiar();
    this.show = false;
  }
  delSintoma(row) {
    this.sintomaSvc.removeSintoma(row.id);
  }
  filtrar(event) {
    if (this.sintomaAux.length > 0) {
      let val = event.target.value.toLowerCase();
      let keys = Object.keys(this.sintomaAux[0]);
      let data = this.sintomaAux;
      this.sintomas = this.sintomaAux.filter(item => {
        return (item.NombreSintoma ? item.NombreSintoma.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.TipoSintoma ? item.TipoSintoma.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.Medida ? item.Medida.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.Puntos ? item.Puntos.toString().toLowerCase().indexOf(val) !== -1 : false)
      }
      );
      this.sintomaAux = data;
    }
  }
}
