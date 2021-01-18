import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TriajePersona } from "../../../../shared/models/triajePersona.interface";
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class TriajeService {
  private triajeCollection: AngularFirestoreCollection<TriajePersona>;
  private triajes: Observable<TriajePersona[]>;

  constructor(private db: AngularFirestore, private storage: Storage) {
    this.triajeCollection = db.collection<TriajePersona>('triajePersona', ref => ref.where('Estado', '==', true).orderBy('Fecha'));
    this.datos();
  }
  datos() {
    this.triajes = this.triajeCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      }
    ));
  }
  getTriajes() {
    this.triajeCollection = this.db.collection<TriajePersona>('triajePersona', ref => ref.where('Estado', '==', true).orderBy('Fecha'));
    this.datos();
    return this.triajes;
  }

  getTriajesPersona(idPersona: string) {
    this.triajeCollection = this.db.collection<TriajePersona>('triajePersona', ref => ref.where('idPersona', '==', idPersona).where('Estado', '==', true).orderBy('Fecha'));
    this.datos();
    return this.triajes;
  }

  getUltimoTriajePersona(idPersona: string) {
    this.triajeCollection = this.db.collection<TriajePersona>('triajePersona', ref => ref.where('idPersona', '==', idPersona).where('Estado', '==', true).orderBy('Fecha').limitToLast(1));
    this.datos();
    return this.triajes;
  }

  getTriaje(id: string) {
    return this.triajeCollection.doc<TriajePersona>(id).valueChanges();
  }

  updateTriaje(triaje: TriajePersona, id: string) {
    let aux = this.triajeCollection.doc<TriajePersona>(id).update(triaje);
    this.actualizarStorage();
    return aux;
  }

  addTriaje(triaje: TriajePersona) {
    let aux = this.triajeCollection.add(triaje);
    this.actualizarStorage();
    return aux;
  }
  removeTriaje(id: string) {
    let aux = this.triajeCollection.doc(id).delete();
    this.actualizarStorage();
    return aux;
  }
  actualizarStorage(){
    this.getTriajes().subscribe(res => { 
        this.storage.set('triajesPersona', res)
    })
  }
}
