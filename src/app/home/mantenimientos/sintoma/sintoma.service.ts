import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Sintoma } from "../../../shared/models/sintoma";
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class SintomaService {
  private sintomasCollection: AngularFirestoreCollection<Sintoma>;
  private sintomas: Observable<Sintoma[]>;

  constructor(db: AngularFirestore, private storage: Storage) {
    this.sintomasCollection = db.collection<Sintoma>('sintoma', ref => ref.orderBy('NombreSintoma'));
    this.sintomas = this.sintomasCollection.snapshotChanges().pipe(map(
      actions=>{ return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data};
      })}
    ));
   }

   getSintomas(){
     return this.sintomas;
   }

   getSintoma(id: string){
    return this.sintomasCollection.doc<Sintoma>(id).valueChanges();
   }

   updateSintoma(sintoma: Sintoma, id:string){
     let aux = this.sintomasCollection.doc<Sintoma>(id).update(sintoma);
     this.actualizarStorage();
     return aux;
   }

   addSintoma(sintoma: Sintoma){
     let aux = this.sintomasCollection.add(sintoma);
     this.actualizarStorage();
     return aux;
   }

   removeSintoma(id:string){      
     let aux = this.sintomasCollection.doc(id).delete();
     this.actualizarStorage();
     return aux;
   }
   actualizarStorage(){
    this.getSintomas().subscribe(res => {
      if(res.length > 0)      
        this.storage.set('sintomas', res)
    })
  }
}
