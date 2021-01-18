import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ProgramaSocial } from "../../../shared/models/programaSocial";
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class ProgramaSocialService {
  private programaSocialCollection: AngularFirestoreCollection<ProgramaSocial>;
  private programasSociales: Observable<ProgramaSocial[]>;

  constructor(db: AngularFirestore, private storage: Storage) {
    this.programaSocialCollection = db.collection<ProgramaSocial>('programaSocial', ref => ref.orderBy('NombreProgramaSocial'));
    this.programasSociales = this.programaSocialCollection.snapshotChanges().pipe(map(
      actions=>{ return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data};
      })}
    ));
   }

   getProgramasSociales(){
     return this.programasSociales;
   }

   getPS(codPS: string){
    return this.programaSocialCollection.doc<ProgramaSocial>(codPS).valueChanges();
   }

   updatePS(ps: ProgramaSocial, codPS:string){
     let aux = this.programaSocialCollection.doc<ProgramaSocial>(codPS).update(ps);
     this.actualizarStorage();
     return aux;
   }

   addPS(ps: ProgramaSocial){
     let aux = this.programaSocialCollection.add(ps);
     this.actualizarStorage();
     return aux;
   }

   removePS(codPS:string){
     let aux = this.programaSocialCollection.doc(codPS).delete();
     this.actualizarStorage();
     return aux;
   }
   actualizarStorage(){
    this.getProgramasSociales().subscribe(res => {
      if(res.length > 0)      
        this.storage.set('programasSociales', res)
    })
  }
}
