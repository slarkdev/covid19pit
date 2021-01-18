import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TipoFactorAnexo } from "../../../shared/models/tipoFactorAnexo";
@Injectable({
  providedIn: 'root'
})
export class TipoFactorAnexoService {
  private tfaCollection: AngularFirestoreCollection<TipoFactorAnexo>;
  private tfas: Observable<TipoFactorAnexo[]>;

  constructor(db: AngularFirestore) {
    this.tfaCollection = db.collection<TipoFactorAnexo>('tipoFactorAnexo', ref => ref.orderBy('NombreTipoFactorAnexo'));
    this.tfas = this.tfaCollection.snapshotChanges().pipe(map(
      actions=>{ return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data};
      })}
    ));
   }

   getTipoFactoresAnexo(){
     return this.tfas;
   }

   getTipoFactorAnexo(id: string){
    return this.tfaCollection.doc<TipoFactorAnexo>(id).valueChanges();
   }

   updateTipoFactorAnexo(ts: TipoFactorAnexo, id:string){
    return this.tfaCollection.doc<TipoFactorAnexo>(id).update(ts);
   }

   addTipoFactorAnexo(ts: TipoFactorAnexo){
    return this.tfaCollection.add(ts);
   }

   removeTipoFactorAnexo(id:string){          
     return this.tfaCollection.doc(id).delete();
   }
}
