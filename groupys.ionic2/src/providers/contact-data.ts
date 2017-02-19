import { Injectable } from '@angular/core';
import { Contacts } from 'ionic-native';
import { Observable } from 'rxjs/Observable';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers } from '@angular/http';
import { HeaderData } from './header-data';
import { UrlData } from './url-data';
//import {SearchJson} from '../../config/search-json/search-json';

@Injectable()
export class ContactData {

  contentHeader: Headers = new Headers({"Content-Type": "application/json"});
  tmpForm:any;
  serviceName:string;

  constructor(private platform: Platform, private storage: Storage, private globalHeaders:HeaderData, private http:Http, private globals:UrlData) {
    this.storage.get('token').then(token => {
      this.contentHeader.append('Authorization', 'Bearer ' + token);
      //console.log("token: " + JSON.stringify(this.contentHeader));
    }).catch(error => {
      console.log(error);
    });

    this.tmpForm = {"1482437956041":{"contacts":['58619c50065b0ea4194a2890','58619c50065b0ea4194a288f','58619c50065b0ea4194a288e']}};
    this.serviceName = 'ContactData ======= ';

  }

  private getAllContacts(){
    let options = {
      multiple: true,
      hasPhoneNumber: true,
      contactFields: ['name']
    };
    this.platform.ready().then(() => {
      //Contacts.find(["*"], options).then((contact) => {
      Contacts.find(['phoneNumbers','displayName','emails'], options).then((contact) => {
        //console.log(contact);
        //contact = this.sortByDisplayName(contact);
        contact.sort(this.compare);
        return contact;
      }, (err) => {console.log(this.serviceName + "error: " + err)})
    });

  }

  private compare(a,b) {
    if (a.displayName< b.displayName)
      return -1;
    if (a.displayName> b.displayName)
      return 1;
    return 0;
  }

  public findByName(name, contacts) {
    //contacts = this.normalizeContacts(contacts);
    return Observable.create(observer => {
      observer.next(contacts);
      //let js = JSON.stringify(contacts);
      let result =[];
      if(name.length>2) {
        result = this.getObjects(contacts,'name',name);
        console.log(this.serviceName + "search name: " + result);
        result = result.concat(this.getObjects(contacts,'number',name));
        console.log(this.serviceName + "search number: " + result);
        observer.next(result);
      } else {
        observer.next(result);
      }
      observer.complete();
    });
  }

  private normalizeContacts(data){
    console.log(this.serviceName + "normalizePhoneBookList-----------------------");
    let tempData = {};
    let i=0;
    for ( let contact in data ) {

      let contactInfo = {};

      contactInfo["number"] = "";
      contactInfo["name"] = "";

      if(data[contact]["number"]){
        contactInfo["number"] = data[contact]["number"];
      }
      if(data[contact]["name"]){
        contactInfo["name"] = data[contact]["name"];
      }

      let tempContact = [];
      tempContact.push(contactInfo);

      tempData[i] = tempContact;
      i++;

    }
    //console.log(JSON.stringify(tempData));
    console.log(this.serviceName +  "normalizePhoneBookList-----------------------");

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

  public uploadGroupContacts(groupID, formID){
    console.log(this.serviceName + "uploadGroupContacts: " + "groupID: " + groupID + " formID: " + formID);
    this.storage.get(formID).then(form => {
     console.log(this.serviceName + JSON.stringify(form[formID]["contacts"]));
     if(form[formID]["contacts"] != undefined || form[formID]["contacts"].length >-1){

       let users = [];
       for(let contact in form[formID]["contacts"]){
         users.push(form[formID]["contacts"][contact]["_id"]);
       }
       console.log(this.serviceName + "users: " + JSON.stringify(users));

       this.http.post(this.globals.GROUP_CONTACTS_URL + groupID , JSON.stringify({users:users}), { headers: this.contentHeader })
       .map(res => res.json())
       .subscribe(
         data => console.log("Added Group Contacts"),
         err => console.log('something went wrong: ' + err),
         () => console.log('Phone Book Check Complete')
         );
       }

       }).catch(error => {
        console.log(error);
       });
    /*
    console.log(this.serviceName +  "GROUP_CONTACTS_URL: " + this.globals.GROUP_CONTACTS_URL + groupID);
    console.log(this.serviceName +  JSON.stringify(this.tmpForm["1482437956041"]["contacts"]));
    console.log(this.serviceName +  JSON.stringify(this.contentHeader));

    this.http.post(this.globals.GROUP_CONTACTS_URL + groupID , JSON.stringify({users:this.tmpForm["1482437956041"]["contacts"]}), { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
        data => console.log(this.serviceName + "Added Group Contacts"),
        err => console.log(this.serviceName + 'something went wrong: ' + err),
        () => console.log(this.serviceName + 'Phone Book Check Complete')
      );
      */
  }
}