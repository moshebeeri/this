import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';




@Injectable()
export class EntityData {
  data: any;

  constructor(public http: Http) { }

  load(): any {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.get('assets/data/entities.json')
        .map(this.processData);
    }
  }

  processData(data) {
    //alert("processData: " + JSON.stringify(data));
    this.data = data.json();
    return this.data;
  }

  public findAll() {
    return this.load().map(data => {
      return data;
    });
  }

  public findById(id) {
    return this.load().map(data => {
      return data[id];
    });
  }

  public findByName(name) {
    //alert("findByName: " + name);
    return this.load().map(data => {
      let result =[];
      result = this.getObjects(data,'shortName',name);
      alert("findByName result: " + JSON.stringify(result));
      return result;
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

}
