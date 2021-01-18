import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FactorAnexo } from "../../../shared/models/factorAnexo";
@Injectable({
  providedIn: 'root'
})
export class FactorAnexoService {
  private faCollection: AngularFirestoreCollection<FactorAnexo>;
  private fas: Observable<FactorAnexo[]>;

  constructor(db: AngularFirestore) {
    this.faCollection = db.collection<FactorAnexo>('factorAnexo', ref => ref.orderBy('NombreFactorAnexo'));
    this.fas = this.faCollection.snapshotChanges().pipe(map(
      actions=>{ return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data};
      })}
    ));
   }

   getFactoresAnexo(){
     return this.fas;
   }

   getFactorAnexo(id: string){
    return this.faCollection.doc<FactorAnexo>(id).valueChanges();
   }

   updateFactorAnexo(fa: FactorAnexo, id:string){
    return this.faCollection.doc<FactorAnexo>(id).update(fa);
   }

   addFactorAnexo(fa: FactorAnexo){
    return this.faCollection.add(fa);
   }

   removeFactorAnexo(id:string){          
     return this.faCollection.doc(id).delete();
   }
}
