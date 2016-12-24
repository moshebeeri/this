import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class CountryData {
  data: any;

  constructor(public http: Http) { }

  load(): any {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.get('assets/data/countries.json')
        .map(this.processData);
    }
  }

  processData(data) {
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
    return this.load().map(data => {
      let js = JSON.stringify(data);
      let result =[];
      if(name.length>2) {
        result = this.getObjects(data,'searchName',name);
      } else if (name.length===2) {
        result = this.getObjects(data,'alpha2Code',name);
      }
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
