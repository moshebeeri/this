import {Injectable} from 'angular2/core';
import {COUNTRIES} from './countries-data';
import {Observable} from 'rxjs/Observable';
//import {SearchJson} from '../../config/search-json/search-json';

@Injectable()
export class CountriesService {
    constructor(/*private searchJson: SearchJson*/) {
        //this.searchJson = searchJson;
    }

    public findAll() {
        return Observable.create(observer => {
            observer.next(COUNTRIES);
            observer.complete();
        });
    }

    public findById(id) {
        return Observable.create(observer => {
            observer.next(COUNTRIES[id - 1]);
            observer.complete();
        });
    }
	
	public findByName(name) {
		return Observable.create(observer => {
			observer.next(COUNTRIES);
			let js = JSON.stringify(COUNTRIES);
            let result =[];
            if(name.length>2) {
                result = this.getObjects(COUNTRIES,'searchName',name);
                observer.next(result);
            } else if (name.length===2) {
                result = this.getObjects(COUNTRIES,'alpha2Code',name);
                observer.next(result);
            } else {
				observer.next(result);
			}
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
}