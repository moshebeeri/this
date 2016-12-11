import {Injectable} from '@angular/core';
import {COUNTRIES} from '../countries/countries-data';
import {Contacts} from 'ionic-native';
import {Observable} from 'rxjs/Observable';
//import {SearchJson} from '../../config/search-json/search-json';

@Injectable()
export class ContactsService {
  constructor(/*private searchJson: SearchJson*/) {
      //this.searchJson = searchJson;
  }

  private getAllContacts(){
    let options = {
      multiple: true,
      hasPhoneNumber: true,
      contactFields: ['displayName']
    };
    Contacts.find(['*'], options).then((contact) => {
      //console.log(contact);
      //contact = this.sortByDisplayName(contact);
      contact.sort(this.compare);
      return contact;
    }, (err) => {console.log("error: " + err)})
  }
  
  private compare(a,b) {
    if (a.displayName< b.displayName)
      return -1;
    if (a.displayName> b.displayName)
      return 1;
    return 0;
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

  public findByName(name, contacts) {
    //contacts = this.normalizeContacts(contacts);
    return Observable.create(observer => {
      observer.next(contacts);
      let js = JSON.stringify(contacts);
        let result =[];
        if(name.length>2) {
          result = this.getObjects(contacts,'displayName',name);
          console.log("========= search displayName: " + result);
          result = result.concat(this.getObjects(contacts,'phoneNumbers',name));
          console.log("========= search phoneNumbers: " + result);
          observer.next(result);
        } else {
          observer.next(result);
      }
      observer.complete();
    });
  }

  private normalizeContacts(data){
    console.log("--------------------normalizePhoneBookList-----------------------");
    let tempData = {};
    let i=0;
    for ( let contact in data ) {

      let contactInfo = {};

      contactInfo["phoneNumbers"] = "";
      contactInfo["displayName"] = "";

      if(data[contact]["phoneNumbers"]){
        contactInfo["phoneNumbers"] = data[contact]["phoneNumbers"][0].value;
      }
      if(data[contact]["displayName"]){
        contactInfo["displayName"] = data[contact]["displayName"];
      }

      let tempContact = [];
      tempContact.push(contactInfo);

      tempData[i] = tempContact;
      i++;

    }
    //console.log(JSON.stringify(tempData));
    console.log("--------------------normalizePhoneBookList-----------------------");

    //let allContacts = [];
    //allContacts.push(tempData);
    return tempData;
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