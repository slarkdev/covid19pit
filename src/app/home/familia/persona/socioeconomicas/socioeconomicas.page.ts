import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-socioeconomicas',
  templateUrl: './socioeconomicas.page.html',
  styleUrls: ['./socioeconomicas.page.scss'],
})
export class SocioeconomicasPage implements OnInit {
  @Input() socioeconomicasForm: FormGroup;
  @Output() datos: EventEmitter<any>  = new EventEmitter();
  constructor() { }

  ngOnInit() { 
  }
  
  addSocioeconomicas() {
    this.datos.emit(this.socioeconomicasForm);
  }
}
