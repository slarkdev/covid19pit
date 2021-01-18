import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  constructor(private authSvc: AuthService, private router: Router, private loadingSvc: LoadingService) { }

  async ngOnInit() {
    try {
      await this.loadingSvc.abrir();
      await this.authSvc.afAuth.onAuthStateChanged(res => {        
        if (res) {
          console.log(res);
          
          const isVerified = this.authSvc.isEmailVerified(res);
          this.redirectUser(isVerified);
        }
        this.loadingSvc.cerrar();
      })
    } catch (error) {
      console.log('on login -> ', error);
      this.loadingSvc.cerrar();
    }
  }

  async onLogin() {
    try {
      await this.loadingSvc.abrir();
      const user = await this.authSvc.login(this.loginForm.value.email, this.loginForm.value.password);
      if (user) {
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
      }
      this.loadingSvc.cerrar();
    } catch (error) {
      console.log('on login -> ', error);
      this.loadingSvc.cerrar();
    }
  }

  private redirectUser(isVerified: boolean): void {
    if (isVerified) {      
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/verify-email']);
    }
  }
}
