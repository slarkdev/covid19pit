import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TipoSintoma } from "../../../shared/models/tipoSintoma";
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class TipoSintomaService {
  private tsCollection: AngularFirestoreCollection<TipoSintoma>;
  private tss: Observable<TipoSintoma[]>;

  constructor(db: AngularFirestore, private storage: Storage) {
    this.tsCollection = db.collection<TipoSintoma>('tipoSintoma', ref => ref.orderBy('NombreTipoSintoma'));
    this.tss = this.tsCollection.snapshotChanges().pipe(map(
      actions=>{ return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data};
      })}
    ));
   }

   getTipoSintomas(){
     return this.tss;
   }

   getTipoSintoma(id: string){
    return this.tsCollection.doc<TipoSintoma>(id).valueChanges();
   }

   updateTipoSintoma(ts: TipoSintoma, id:string){
     let aux = this.tsCollection.doc<TipoSintoma>(id).update(ts);
     this.actualizarStorage();
     return aux;
   }

   addTipoSintoma(ts: TipoSintoma){
     let aux = this.tsCollection.add(ts);
     this.actualizarStorage();
     return aux;
   }

   removeTipoSintoma(id:string){
     let aux =this.tsCollection.doc(id).delete();
     this.actualizarStorage();
     return aux;
   }
   actualizarStorage(){
    this.getTipoSintomas().subscribe(res => {
      if(res.length > 0)      
        this.storage.set('tiposSintomas', res)
    })
  }
}
