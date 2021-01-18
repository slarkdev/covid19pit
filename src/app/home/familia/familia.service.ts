import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Familia } from "../../shared/models/familia";
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class FamiliaService {
  private familiaCollection: AngularFirestoreCollection<Familia>;
  private familias: Observable<Familia[]>;

  constructor(private db: AngularFirestore, private storage: Storage) {
    this.familiaCollection = db.collection<Familia>('familia', ref => ref.where('Estado', '==', true ).orderBy('DNI'));
  }
  datos() {
    this.familias = this.familiaCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      }
    ));
  }

  getFamilias() {
    this.familiaCollection = this.db.collection<Familia>('familia', ref => ref.where('Estado', '==', true ).orderBy('DNI'));
    this.datos();
    return this.familias;
  }

  getFamilia(id: string) {
    return this.familiaCollection.doc<Familia>(id).valueChanges();
  }

  updateFamilia(familia: Familia, id: string) {
    let aux = this.familiaCollection.doc<Familia>(id).update(familia);
    this.actualizarStorage();
    return aux;
  }

  addFamilia(familia: Familia) {
    let aux = this.familiaCollection.add(familia);
    this.actualizarStorage();
    return aux;
  }

  removeFamilia(id: string) {
    let aux = this.familiaCollection.doc(id).delete();
    this.actualizarStorage();
    return aux;
  }
  actualizarStorage() {
    this.getFamilias().subscribe(res => {
        this.storage.set('familias', res)
    })
  }
}
