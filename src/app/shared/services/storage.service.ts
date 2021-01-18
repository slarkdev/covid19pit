import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
@Injectable({
    providedIn: 'root'
})
export class StorageService {


    constructor(private storage: Storage) { }

    addItem(item, nombreArray: string): Promise<any> {
        return this.storage.get(nombreArray).then((items: any[]) => {
            if (items) {
                items.push(item);
                return this.storage.set(nombreArray, [item]);
            } else {
                return this.storage.set(nombreArray, [item]);
            }
        });
    }

    getItems(nombreArray): Promise<any> {
        return this.storage.get(nombreArray)
    }

    updateItem(item, nombreArray) {
        return this.storage.get(nombreArray).then((items: any[]) => {
            if (!items || items.length === 0) {
                return null;
            }
            let newItems: any[] = [];
            for (let i of items) {
                if (i.id === item.id) {
                    newItems.push(item)
                } else {
                    newItems.push(i);
                }
            }
            return this.storage.set(nombreArray, newItems);

        });
    }

    deleteItem(id: string, nombreArray): Promise<any> {
        return this.storage.get(nombreArray).then((items: any[]) => {
            if (!items || items.length === 0) {
                return null;
            }

            let tokeep: any[] = [];
            for (let i of items) {
                if (i.id !== id) {
                    tokeep.push(i);
                }
            }
            return this.storage.set(nombreArray, tokeep);
        })
    }
}