import {Page, NavController} from 'ionic-angular';
import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Contacts} from 'ionic-native';
import {Http, Headers} from '@angular/http';
import {SMS} from 'ionic-native';
import {LazyLoadImageDirective} from 'ng2-lazyload-image';
import {GlobalsService} from '../../services/globals/globals';
import {AuthService} from '../../services/auth/auth';
import {GlobalHeaders} from '../../services/headers/headers';
//import {TimerWrapper} from 'angular2/src/facade/async';
import {HomePage} from '../home/home';


/*
  Generated class for the ContactsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/contacts/contacts.html',
  providers : [Contacts, GlobalsService, GlobalHeaders, AuthService, SMS],
  directives: [LazyLoadImageDirective]
})
export class ContactsPage {
  phoneContacts: Array;
  xContacts: any;
  xxContacts: string;
  xxxContacts: string;
  phonebook: any;
  contentHeader: Headers = new Headers();
  error: string;
  picExist: boolean;
  test: boolean;
  imageRetries: number;
  isImage: any;
  url: any;
  xxx: any;
  defaultImage: string;
  offset: number;
  private start:number=0;
  private end:number=20;



  constructor(public nav: NavController, public contacts: Contacts, private globals:GlobalsService, private globalHeaders:GlobalHeaders, private http:Http, private cdr:ChangeDetectorRef) {
    this.http = http;
    this.globals = globals;
    this.globalHeaders = globalHeaders;
    this.contentHeader = this.globalHeaders.getMyGlobalHeaders();
    this.imageRetries = 0;
    this.isImage = {};
    this.url = [];
    this.test = true;
    let session = new Date();
    let dontCache = session.getTime();
    this.xxx = dontCache;
    
    this.defaultImage = 'img/avatar3.png';
    this.offset = 100;
    //this.phonebook = [];
      /*
	  this.contacts = Contacts;

    this.contacts.find("*", "").then(
        (contacts) => {
          for (let i = 0; i < contacts.length; i++) {
            let contact = contacts[i];
            this.phoneContacts.push(contact);
          }
          console.log("contacts: " + JSON.stringify(contacts))},
        (err) => {console.log("error: " + err)})
	*/
	  this.getContacts();
    
  }
  
  getContacts(){
	let options = {
	  multiple: true,
	  hasPhoneNumber: true,
	  contactFields: ['displayName']
	};
    Contacts.find(['*'], options).then((contact) => {
      this.phoneContacts = contact;
      this.phonebook = [];
      for(let i=0,  length=contact.length; i < length; i++){
        this.phonebook[i] = {};
        if(contact[i]['phoneNumbers']){
          this.phonebook[i]['normalized_number'] = contact[i]['phoneNumbers'][0].value || null;
          this.phonebook[i]['number'] = contact[i]['phoneNumbers'][0].value || null;

          this.isImage[contact[i]['phoneNumbers'][0].value] = true;
        }
        if(contact[i]['displayName']){
          this.phonebook[i]['name'] = contact[i]['displayName'] || null;
        }
        if(contact[i]['emails']){
          this.phonebook[i]['email'] = contact[i]['emails'][0].value || null;
        }

      }

      this.xContacts = JSON.stringify(contact[1]);
      this.xxContacts = JSON.stringify(contact[1]['phoneNumbers'][0].value);
      this.xxxContacts = JSON.stringify(contact[1]['emails'][0].value);
      //console.log(this.phoneContacts); // This shows the complete object.
      //console.log(this.phoneContacts.displayName); // it says undefined :( IDK why....
    }, (err) => {console.log("error: " + err)})
  
  }

  sendContacts(){
    this.http.post(this.globals.PHONE_BOOK_URL, JSON.stringify({phonebook:this.phonebook}), { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
          data => console.log(data),
          err => this.error = err,
          () => console.log('Phone Book Export Complete')
      );
  }

  sendSMS(phoneNumber){
    console.log("sending SMS");
    let number = phoneNumber;
    let message = 'Check out GROUPYS discounts for your smartphone. Download it today from https://groupys.com/dl/';
    let options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
        intent: 'INTENT'  // send SMS with the native android SMS messaging
        //intent: '' // send SMS without open any other app
      }
    };

    //let success = function () { console.log('Message sent successfully'); };
    //let error = function (e) { console.log('Message Failed:' + e); };

    SMS.send(number, message, options);
  }


  back(){
    this.nav.pop();
    this.nav.setRoot(HomePage);
  }
  /*
  isImages(phoneNumber){
    TimerWrapper.setTimeout(() => {
      if(!this.isImage[phoneNumber]){
        return this.isImage[phoneNumber];
      } else {
        return !this.isImage[phoneNumber];
      }
    }, 5000);
  }*/



  isPic(number){
    this.picExist = true;
    return "img/" + number + ".jpg";
  }
  noPic(){
    this.picExist = false;
    return "img/avatar.png";
  }
  setContact(data){
    return data;
  }


  private unsub;


  private detach() {
    this.cdr.detach();
  }

  private getImageUrl(phoneNumber) {
    //let url = '';
    /*switch (this.imageRetries){
      case 0: {
        this.url[phoneNumber] = 'img/' + phoneNumber + '.jpg';
        console.log("case 0: " + this.url[phoneNumber]);
        break;
      }
      case 1: {
        this.url[phoneNumber] = 'img/' + phoneNumber + '.jpg';
        console.log("case 1: " + this.url[phoneNumber]);
        break;
      }
      default: {
        //this.isImage[phoneNumber] = false;
        this.url[phoneNumber] = 'img/avatar3.png';
        console.log("case default: " + this.url[phoneNumber]);
        break;
      }

    }*/
    ////return this.url[phoneNumber];
    let session = new Date();
    let dontCache = session.getTime();
    //return this.url[phoneNumber] = 'img/' + phoneNumber + '.jpg'+"?time="+dontCache;
    return this.url[phoneNumber] = 'img/' + phoneNumber + '.jpg';
  }

  private onImageLoaded(phoneNumber) {
    //this.isImage[phoneNumber] = true;
    this.detach();
  }

  private onImageError(phoneNumber) {
    this.isImage[phoneNumber] = false;
    //let url = 'img/avatar2.png';
    //console.log("onImageError: " + phoneNumber + " : "  + this.isImage[phoneNumber]);
    //return url;
    ////this.imageRetries++;
  }
  
  /*doInfinite(infiniteScroll:any) {
     console.log('doInfinite, start is currently '+this.start);
     this.start+=20;
     this.end+=20;
     
     this.loadPeople().then(()=>{
       infiniteScroll.complete();
     });
     
  }*/

}
