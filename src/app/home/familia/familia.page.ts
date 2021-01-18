import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Familia } from 'src/app/shared/models/familia';
import { FamiliaService } from './familia.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Storage } from '@ionic/storage';
import { PersonaService } from './persona/persona.service';
@Component({
  selector: 'app-familia',
  templateUrl: './familia.page.html',
  styleUrls: ['./familia.page.scss'],
})
export class FamiliaPage implements OnInit {
  @ViewChild('myTable') table: any;

  familias: Familia[] = new Array<Familia>();
  familiaAux: Familia[];
  familiaForm: FormGroup;
  familia: Familia = new Familia();
  show: boolean = false;
  modify: boolean = false;
  constructor(
    private familiaSvc: FamiliaService,
    private storage: Storage,
    private router: Router,
    private personaSvc: PersonaService
  ) { }

  async ngOnInit() {
    this.listarFamilias();
  }
  async listarFamilias(){
    try {
      await this.familiaSvc.getFamilias().subscribe(res => {

        console.log(res);
        
        if(res.length === 0){
          this.storage.get('familias').then( (array) => {
            this.familias = array;
          })
        } else {
          this.familias = res;
        }        
        this.familiaAux = this.familias;

      });
    } catch (error) {
      console.log('error');
    }
  }

  detalleFamilia(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  add() {
    this.router.navigate(['home/familia/add/persona/add'])
  }
  refresh(){
    this.listarFamilias();
  }

  seePersonas(row) {
    this.router.navigate(['home/familia/', row.id])
  }
  seeConsolidado(row) {
    this.router.navigate(['home/familia/consolidado/', row.id])
  }
  delFamilia(row) {
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
        this.familiaSvc.updateFamilia(row, row.id);
        // this.familiaSvc.removeFamilia(row.id);
        this.personaSvc.getPersonasFamilia(row.id).subscribe(array => {
          array.forEach(element => {
            this.personaSvc.updatePersona(element, element.id);
            // this.personaSvc.removePersona(element.id);
          });
        })
      }
    });
  }

  filtrar(event) {
    if (this.familiaAux.length > 0) {
      let val = event.target.value.toLowerCase();
      let data = this.familiaAux;
      this.familias = this.familiaAux.filter(item => {
        return (item.DNI ? item.DNI.toString().toLowerCase().indexOf(val) !== -1 : false) ||
          (item.ApellidoPaterno ? item.ApellidoPaterno.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.ApellidoMaterno ? item.ApellidoMaterno.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.Nombres ? item.Nombres.toString().toLowerCase().indexOf(val) !== -1 : false) || (item.CentroPoblado ? item.CentroPoblado.toString().toLowerCase().indexOf(val) !== -1 : false)
      }
      );
      this.familiaAux = data;
    }
  }
}
