import { Injectable } from '@angular/core';
import { User } from '../../shared/models/user.interface';
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from 'firebase';
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { of, Observable } from 'rxjs';
import { switchMap } from "rxjs/operators";
import { RoleValidator } from '../helpers/roleValidator';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class AuthService extends RoleValidator {

  public user$: Observable<User>;

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {
    super();
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {

          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    )
  }

  datosUsuario(){  
    return this.user$;
  }
  async loginGoogle(): Promise<User> {
    try {
      const { user } = await this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
      this.updateUserData(user);
      return user;
    } catch (error) {
      console.log("loginGoogle -> ", error);
    }
  }
  async login(email: string, password: string): Promise<User> {
    try {  
        const { user } = await this.afAuth.signInWithEmailAndPassword(email, password);
        return user;
    } catch (error) {
      let message = error.message ? error.message : 'Ocurrió un error';
      if(error.code === "auth/invalid-email"){
        message = 'Ingrese un correo válido';
      }
      if(error.code === "auth/wrong-password"){
        message = 'El usuario o contraseña son incorrectos';
      }
      if(error.code === "auth/user-not-found"){
        message = 'El usuario no existe o fue eliminado';
      }

      if(error.code === "auth/network-request-failed"){
        message = 'Necesita conexión de red para iniciar sesión';
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonColor: '#3085d6',    
        confirmButtonText: 'OK',
      })
      console.log("login -> ", error);
    }
  }

  async sendVerificationEmail(): Promise<void> {
    try {
      return (await this.afAuth.currentUser).sendEmailVerification();
    } catch (error) {
      console.log("send email -> ", error);
    }
  }

  isEmailVerified(user: User): boolean {
    return user.emailVerified;
  }

  async register(nombres:string, email: string, password: string): Promise<User> {
    try {
      const { user } = await this.afAuth.createUserWithEmailAndPassword(email, password);      
      
      this.updateUserData(user, nombres);
      //enviar email de verificacion
      this.sendVerificationEmail();
      return user;
    } catch (error) {
      if(error.code === 'auth/email-already-in-use'){
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El correo ya se encuentra en uso',
          confirmButtonColor: '#3085d6',    
          confirmButtonText: 'OK',
        })
      }
      console.log("register -> ", error);
    }
  }
  async resetPassword(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log('reset password -> ', error);

    }
  }
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.log("logout -> ", error);
    }
  }

  private updateUserData(user: User, nombres?: string) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: nombres ? nombres : user.displayName,
      photoURL: user.photoURL,
      role: 'ENCUESTADOR',
    };
    return userRef.set(data, { merge: true });
  }
}
