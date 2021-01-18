import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user.interface';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnDestroy {
  public user$: Observable<User> = this.authSvc.afAuth.user;
  constructor(private authSvc: AuthService,
    private router: Router,
    public alertController: AlertController) { }

  ngOnDestroy() {
    this.authSvc.logout();
    this.router.navigate(['/login'])
  }
 
  async onSendEmail(): Promise<void> {
    try {
      await this.authSvc.sendVerificationEmail();
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Verificar Correo',
        message: 'Se volvió a enviar el correo. Revise su bandeja de entrada',
        buttons: ['OK']
      });
      await alert.present();
      this.router.navigate(['/login']);
    } catch (error) {
      console.log("onSendEmail ->", error);
    }
  }
}
