import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm = new FormGroup({
    nombres: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  constructor(private authSvc: AuthService, private router: Router) { }

  ngOnInit() {
  }

  async onRegister() {
    // const { email, password } = this.registerForm.value;
    try {
      if (this.registerForm.valid) {
        const user = await this.authSvc.register(this.registerForm.value.nombres, this.registerForm.value.email, this.registerForm.value.password);
        if (user) {
          const isVerified = this.authSvc.isEmailVerified(user);
          this.redirectUser(isVerified);
        }
      }
    } catch (error) {
      let message = error.message ? error.message : 'Ocurrió un error';
      if (error.code === "auth/weak-password") {
        message = 'La contraseña debe tener al menos 6 caracteres';
      }
      if (error.code === "auth/invalid-email") {
        message = 'Ingrese un correo válido';
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
      console.log('on register -> ', error);
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
