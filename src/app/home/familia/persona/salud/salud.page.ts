import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormGroup} from '@angular/forms';
@Component({
  selector: 'app-salud',
  templateUrl: './salud.page.html',
  styleUrls: ['./salud.page.scss'],
})
export class SaludPage implements OnInit {
  @Input() saludForm: FormGroup;
  @Output() datos: EventEmitter<any>  = new EventEmitter();
  constructor() { }

  async ngOnInit() {
    
  }
  addSalud() {
    this.datos.emit(this.saludForm);
  }
}
