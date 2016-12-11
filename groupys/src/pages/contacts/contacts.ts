import {NavController, Platform} from 'ionic-angular';
import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Contacts} from 'ionic-native';
import {Http, Headers} from '@angular/http';
import {SMS} from 'ionic-native';
//import {LazyLoadImageDirective} from 'ng2-lazyload-image';
import {GlobalsService} from '../../services/globals/globals';
import {AuthService} from '../../services/auth/auth';
import {GlobalHeaders} from '../../services/headers/headers';
import {ContactsService} from './contacts-service';
//import {TimerWrapper} from 'angular2/src/facade/async';
import {HomePage} from '../home/home';


/*
  Generated class for the ContactsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'contacts.html',
  //directives: [LazyLoadImageDirective],
  providers : [Contacts, GlobalsService, GlobalHeaders, AuthService, SMS, ContactsService]

})
export class ContactsPage {
  phoneContacts: Array<string>;
  phoneContacts2: Array<string>;
  inviteButtons: Object;
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
  queryText:string;
  toggleToolbar:boolean;
  items: Array<string>;


  constructor(private platform: Platform, public nav: NavController, public contacts: Contacts, private globals:GlobalsService, private globalHeaders:GlobalHeaders, private http:Http, private cdr:ChangeDetectorRef, private contactsService:ContactsService) {
    this.platform = platform;
    this.http = http;
    this.globals = globals;
    this.globalHeaders = globalHeaders;
    this.contactsService = contactsService;
    this.contentHeader = this.globalHeaders.getMyGlobalHeaders();
    this.imageRetries = 0;
    this.isImage = {};
    this.url = [];
    this.test = true;
    let session = new Date();
    let dontCache = session.getTime();
    this.xxx = dontCache;
    this.phoneContacts =[];
    this.phoneContacts2 =[];

    this.defaultImage = 'assets/img/avatar3.png';
    this.offset = 100;
    this.queryText = '';
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
			//console.log(contact);
			//contact = this.sortByDisplayName(contact);
			contact.sort(this.compare);
      this.phoneContacts2 = contact;
      this.phoneContacts = this.normalizeContacts(contact);
      this.inviteButtons = this.normalizePhoneBookList(contact);
      this.phonebook = [];
      for(let i=0, length=contact.length; i < length; i++){
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

      this.sendAndCheckContacts();

      /*this.xContacts = JSON.stringify(contact[1]);
      this.xxContacts = JSON.stringify(contact[1]['phoneNumbers'][0].value);
      this.xxxContacts = JSON.stringify(contact[1]['emails'][0].value);*/
      //console.log(this.phoneContacts); // This shows the complete object.
      //console.log(this.phoneContacts.displayName); // it says undefined :( IDK why....
    }, (err) => {console.log("error: " + err)})

  }

  sendAndCheckContacts(){
    this.http.post(this.globals.PHONE_BOOK_URL, JSON.stringify({phonebook:this.phonebook}), { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
          data => this.compareInviteButtons(data),
          err => this.error = err,
          () => console.log('Phone Book Export Complete')
      );
  }
  checkContacts(){
    this.http.post(this.globals.CHECK_PHONE_NUMBERS_URL, JSON.stringify({phonebook:this.phonebook}), { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
        data => console.log("checkContacts"),
        err => this.error = err,
        () => console.log('Phone Book Check Complete')
      );
  }
  compareInviteButtons(data){
    for ( let contact in data ) {
      //console.log("----------------compareInviteButtons-------------------");
      //console.log(data[contact]);
      this.inviteButtons[contact]["invite"] = true;
      //console.log(this.inviteButtons[contact]);
      //console.log("----------------compareInviteButtons-------------------");
    }
  }

  normalizePhoneBookList(data){
    console.log("--------------------normalizePhoneBookList-----------------------");
    let tempData = {};
    for ( let contact in data ) {

      let contactInfo = {};
      contactInfo["invite"] = false;
      contactInfo["displayName"] = data[contact]["displayName"];

      let tempContact = [];
      tempContact.push(contactInfo);

      //console.log(JSON.stringify(contactInfo));
      //console.log(JSON.stringify(tempContact));

      if(data[contact]["phoneNumbers"]){
        contactInfo["phoneNumbers"] = data[contact]["phoneNumbers"][0].value;
        //console.log(data[contact]["phoneNumbers"][0].value);
        //console.log(data[contact]["displayName"]);

        tempData[data[contact]["phoneNumbers"][0].value] = tempContact;
        //console.log(JSON.stringify(tempData[data[contact]["phoneNumbers"][0].value]));
      }
    }
    //console.log(JSON.stringify(tempData));
    //console.log("--------------------normalizePhoneBookList-----------------------");

    let allContacts = [];
    allContacts.push(tempData);
    return tempData;
  }
	
	normalizeContacts(data){
    console.log("--------------------normalizeContacts-----------------------");
    //console.log(JSON.stringify(data));
    let tempData = [];
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

      tempData[i] = contactInfo;
      i++;

    }
    //console.log(JSON.stringify(tempData));
    console.log("--------------------normalizeContacts-----------------------");

    //let allContacts = [];
    //allContacts.push(tempData);
    return tempData;
  }

  sendSMS(phoneNumber){
    alert("sending SMS");
    alert(phoneNumber);
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

    this.platform.ready().then(() => {
      SMS.send(number, message, options)
        .then(()=>{
          alert("success");
        },(e)=>{
          alert("failed: " + e);
        });
    });


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
    return "assets/img/" + number + ".jpg";
  }
  noPic(){
    this.picExist = false;
    return 'assets/img/avatar3.png';
  }
  setContact(data){
    return data;
  }


  private unsub;


  private detach() {
    this.cdr.detach();
		////this.cdr.reattach();
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
    return this.url[phoneNumber] = 'assets/img/' + phoneNumber + '.jpg';
  }

  private onImageLoaded(phoneNumber) {
    //this.isImage[phoneNumber] = true;
    ////this.detach();
  }

  private onImageError(phoneNumber) {
    this.isImage[phoneNumber] = false;
    //let url = 'img/avatar2.png';
    //console.log("onImageError: " + phoneNumber + " : "  + this.isImage[phoneNumber]);
    //return url;
    ////this.imageRetries++;
  }

	private compare(a,b) {
		if (a.displayName< b.displayName)
			 return -1;
		if (a.displayName> b.displayName)
			return 1;
		return 0;
	}

  toggleToolbars(){
    this.toggleToolbar = !this.toggleToolbar;
  }
  searchLowerCase(){
    let lowerInput = this.queryText.toLowerCase();
    this.searchContacts(lowerInput);
  }
  searchContacts(queryText){
    console.log(this.phoneContacts);
    console.log(queryText);
    this.items = [];
    this.contactsService.findByName(queryText,this.phoneContacts).subscribe(
      data => this.items = data
    );
  }

  onHold(contacts){
    alert(JSON.stringify(contacts));
    alert("-----------onHold-------------");
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
