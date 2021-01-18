import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Persona } from "../../../shared/models/persona.interface";
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private personaCollection: AngularFirestoreCollection<Persona>;
  private personas: Observable<Persona[]>;
  constructor(private db: AngularFirestore,
    private storage: Storage) {
    this.personaCollection = this.db.collection<Persona>('persona', ref =>
      ref.where('Estado', '==', true).orderBy('DNI'));
    this.datos();
  }
  datos() {
    this.personas = this.personaCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      }
    ));
  }
  getPersonas() {
    //return this.personas;
    this.personaCollection = this.db.collection<Persona>('persona', ref => ref.where('Estado', '==', true).orderBy('DNI'));
    this.datos();
    return this.personas;
  }
  getPersonasFamilia(idFamilia: string) {
    this.personaCollection = this.db.collection<Persona>('persona', ref => ref.where('idFamilia', '==', idFamilia).where('Estado', '==', true).orderBy('DNI'));
    this.datos();
    return this.personas;
  }
  getPersona(id: string) {
    return this.personaCollection.doc<Persona>(id).valueChanges();
  }

  getPersonaDNI(id: string, DNI: string) {
    return this.personaCollection.doc<Persona>(id).valueChanges();
  }

  updatePersona(persona: Persona, id: string) {
    let aux = this.personaCollection.doc<Persona>(id).update(persona);
    this.actualizarStorage();
    return aux;
  }

  addPersona(persona: Persona) {
    let aux = this.personaCollection.add(persona);
    this.actualizarStorage();
    return aux;
  }

  removePersona(id: string) {    
    let aux = this.personaCollection.doc(id).delete();
    this.actualizarStorage();
    return aux;
  }

  actualizarStorage(){
    this.getPersonas().subscribe(res => {
      if(res.length > 0)      
        this.storage.set('personas', res)
    })
  }
}
