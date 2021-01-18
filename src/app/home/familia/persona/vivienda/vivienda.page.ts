import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-vivienda',
  templateUrl: './vivienda.page.html',
  styleUrls: ['./vivienda.page.scss'],
})
export class ViviendaPage implements OnInit {
  @Input() viviendaForm: FormGroup;
  @Output() datos: EventEmitter<any>  = new EventEmitter();
  constructor() { }

  ngOnInit() { 
  }
  
  addVivienda() {
    this.datos.emit(this.viviendaForm);
  }
}
