import {Injectable} from '@angular/core';
import {ENTITIES} from './entities-data';
import {Observable} from 'rxjs/Observable';
//import {SearchJson} from '../../config/search-json/search-json';

@Injectable()
export class EntitiesService {
    constructor(/*private searchJson: SearchJson*/) {
        //this.searchJson = searchJson;
    }

    public findAll() {
      return Observable.create(observer => {
        observer.next(ENTITIES);
        observer.complete();
      });
    }

    public findById(id) {
      return Observable.create(observer => {
        observer.next(ENTITIES[id - 1]);
        observer.complete();
      });
    }

    public findByName(name) {
      return Observable.create(observer => {
        observer.next(ENTITIES);
        let js = JSON.stringify(ENTITIES);
        let result =[];
        result = this.getObjects(ENTITIES,'shortName',name);
        observer.next(result);
        observer.complete();
      }); 
    }

    public getObjects(obj, key, val) {
      let objects = [];
      for (let i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(this.getObjects(obj[i], key, val));
        } else
        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        if (i == key && obj[i] == val || i == key && val == '' || i == key && obj[i].indexOf(val) > -1) { //
            objects.push(obj);
        } else if (obj[i] == val && key == ''){
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
      }
      return objects;
    }
    public printSomething(anything){
      console.log(anything);
    }
}