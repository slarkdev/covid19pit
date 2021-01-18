import { Component, OnInit } from '@angular/core';
import { BDService } from "../../shared/services/bd.service";
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
})
export class NotFoundPage implements OnInit {
  constructor(private bdService: BDService) { }

  ngOnInit() {
    this.bdService.descargarBD();
  }
}
