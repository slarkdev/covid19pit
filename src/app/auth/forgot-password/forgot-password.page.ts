import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  userEmail = new FormControl('');
  constructor(private authSvc: AuthService, private router: Router) { }

  ngOnInit() {
  }

  async onReset() {
    try {
      const email = this.userEmail.value;
      await this.authSvc.resetPassword(email);
      window.alert('Correo enviado, revise su bandeja');
      this.router.navigate(['/login'])
    } catch (error) {
      let message = error.message ? error.message : 'Ocurrió un error';
      if(error.code === "auth/user-not-found"){
        message = 'El correo no esta asociado a un usuario';
      }
      if(error.code === "auth/invalid-email"){
        message = 'Ingrese un correo válido';
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonColor: '#3085d6',    
        confirmButtonText: 'OK',
      })
      
      console.log('onReset ', error);
    }
  }
}
