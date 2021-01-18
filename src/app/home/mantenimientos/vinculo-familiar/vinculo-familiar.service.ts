import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { VinculoFamiliar } from "../../../shared/models/vinculoFamiliar";
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class VinculoFamiliarService {
  private vinculoFamiliarCollection: AngularFirestoreCollection<VinculoFamiliar>;
  private vinculosFamiliares: Observable<VinculoFamiliar[]>;

  constructor(db: AngularFirestore, private storage: Storage) {
    this.vinculoFamiliarCollection = db.collection<VinculoFamiliar>('vinculoFamiliar', ref => ref.orderBy('NombreVinculoFamiliar'));
    this.vinculosFamiliares = this.vinculoFamiliarCollection.snapshotChanges().pipe(map(
      actions=>{ return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data};
      })}
    ));
   }

   getVinculosFamiliares(){
     return this.vinculosFamiliares;
   }

   getVF(codVF: string){
    return this.vinculoFamiliarCollection.doc<VinculoFamiliar>(codVF).valueChanges();
   }

   updateVF(vf: VinculoFamiliar, codVF:string){
     let aux = this.vinculoFamiliarCollection.doc<VinculoFamiliar>(codVF).update(vf);
     this.actualizarStorage();
     return aux;
   }

   addVF(vf: VinculoFamiliar){
     let aux = this.vinculoFamiliarCollection.add(vf);
     this.actualizarStorage();
     return aux;
   }

   removeVF(codVF:string){
     let aux = this.vinculoFamiliarCollection.doc(codVF).delete();
     this.actualizarStorage();
     return aux;
   }
   actualizarStorage(){
    this.getVinculosFamiliares().subscribe(res => {
      if(res.length > 0)      
        this.storage.set('vinculosFamiliares', res)
    })
  }
}
