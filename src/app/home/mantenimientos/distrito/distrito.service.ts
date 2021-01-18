import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Distrito } from "../../../shared/models/distrito";
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class DistritoService {
  private distritosCollection: AngularFirestoreCollection<Distrito>;
  private distritos: Observable<Distrito[]>;

  constructor(db: AngularFirestore, private storage: Storage) {
    this.distritosCollection = db.collection<Distrito>('distrito', ref => ref.orderBy('NombreDistrito'));
    this.distritos = this.distritosCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      }
    ));
  }

  getDistritos() {
    return this.distritos;
  }

  getDistrito(id: string) {
    return this.distritosCollection.doc<Distrito>(id).valueChanges();
  }

  updateDistrito(distrito: Distrito, id: string) {
    let aux = this.distritosCollection.doc<Distrito>(id).update(distrito);
    this.actualizarStorage();
    return aux;
  }

  addDistrito(distrito: Distrito) {
    let aux = this.distritosCollection.add(distrito);
    this.actualizarStorage();
    return aux;
  }

  removeDistrito(id: string) {
    let aux = this.distritosCollection.doc(id).delete();
    this.actualizarStorage();
    return aux;
  }

  actualizarStorage() {
    this.getDistritos().subscribe(res => {
      if (res.length > 0)
        this.storage.set('distritos', res)
    })
  }
}
