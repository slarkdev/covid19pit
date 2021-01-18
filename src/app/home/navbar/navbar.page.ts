import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { ɵangular_packages_platform_browser_platform_browser_d } from '@angular/platform-browser';
import { User } from 'src/app/shared/models/user.interface';
import { BDService } from 'src/app/shared/services/bd.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.page.html',
  styleUrls: ['./navbar.page.scss'],
})
export class NavbarPage implements OnInit {
  user: User;
  show: boolean = false;
  constructor(private authSvc: AuthService,
    private router: Router,
    private bdService: BDService) { }

  ngOnInit() {
     this.authSvc.datosUsuario().subscribe( res =>  {     
       this.user = res}
    );
  }
  goHome(){
    this.router.navigate(['home']);
  }
  personas() { 
    this.router.navigate(['home/paciente']);
  }
  
  //Rutas hacia los mantenimientos
  factoresAnexos(){
    this.router.navigate(['home/factor-anexo']);
  }
  tipoFactoresAnexos(){
    this.router.navigate(['home/tipo-factor-anexo']);
  }
  sintoma() {
    this.router.navigate(['home/sintoma']);
  }
  tipoSintoma() {
    this.router.navigate(['home/tipo-sintoma']);
  }
  centroPoblado() {
    this.router.navigate(['home/centro-poblado']);
  }
  distrito() {
    this.router.navigate(['home/distrito']);
  }
  programaSocial() {
    this.router.navigate(['home/programa-social']);
  }
  vinculoFamiliar() {
    this.router.navigate(['home/vinculo-familiar']);
  }
  familia(){
    this.router.navigate(['home/familia']);
  }
  async logout() {
    try {
      this.bdService.descargarBD();
      await this.authSvc.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.log(error);
    }
  }
}
