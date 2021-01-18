import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CentroPoblado } from "../../../shared/models/comunidad";
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class CentroPobladoService {
  private comunidadesCollection: AngularFirestoreCollection<CentroPoblado>;
  private comunidades: Observable<CentroPoblado[]>;

  constructor(db: AngularFirestore, private storage: Storage) {
    
    
    this.comunidadesCollection = db.collection<CentroPoblado>('centroPoblado', ref => ref.orderBy('NombreCentroPoblado'));
    this.comunidades = this.comunidadesCollection.snapshotChanges().pipe(map(
      actions=>{ return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data};
      })}
    ));
   }

   getComunidades(){
     return this.comunidades;
   }

   getComunidad(id: string){
    return this.comunidadesCollection.doc<CentroPoblado>(id).valueChanges();
   }

   updateComunidad(comunidad: CentroPoblado, id:string){
     let aux = this.comunidadesCollection.doc<CentroPoblado>(id).update(comunidad);
     this.actualizarStorage();
     return aux;
   }

   addComunidad(comunidad: CentroPoblado){
     let aux = this.comunidadesCollection.add(comunidad);
     this.actualizarStorage();
     return aux;
   }

   removeComunidad(id:string){
     let aux = this.comunidadesCollection.doc(id).delete();
     this.actualizarStorage();
     return aux;
   }
   actualizarStorage(){
    this.getComunidades().subscribe(res => {
      if(res.length > 0)      
        this.storage.set('centrosPoblados', res)
    })
  }
}
