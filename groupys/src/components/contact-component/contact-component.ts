import { App, NavController, Platform, Modal } from 'ionic-angular';
import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Contacts } from 'ionic-native';
import { Http, Headers } from '@angular/http';
import { SMS } from 'ionic-native';
import { Storage } from '@ionic/storage';

import { UserData } from '../../providers/user-data';
import { CountryData } from '../../providers/country-data';
import { UrlData } from '../../providers/url-data';
import { HeaderData } from '../../providers/header-data';
import { ContactData } from '../../providers/contact-data';
import { GroupPage } from '../../pages/group/group';

@Component({
  selector: 'contact-add',
  templateUrl:'contact-component.html'

})
export class ContactComponent{

  @Input() data;
  @Input() formID;
  @Input() pageType;

  phoneContacts: Array<string>;
  phoneContacts2: any;
  inviteButtons: Object;
  groupContacts: any;
  groupContactsIndex: any;
  xContacts: any;
  xxContacts: string;
  xxxContacts: string;
  phonebook: any;
  contentHeader: Headers = new Headers({"Content-Type": "application/json"});
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
  isContact:boolean;
  items: Array<string>;

  constructor(private _app: App, private storage: Storage, private platform: Platform, public nav: NavController, public contacts: Contacts, private globals:UrlData, private globalHeaders:HeaderData, private http:Http, private cdr:ChangeDetectorRef, private contactsService:ContactData) {

    this.platform = platform;
    this.http = http;
    this.globals = globals;
    this.globalHeaders = globalHeaders;
    this.contactsService = contactsService;
    this.groupContacts = [];
    this.groupContactsIndex = {};
    //this.contentHeader = this.globalHeaders.getMyGlobalHeaders();
    this.storage.get('token').then(token => {
      this.contentHeader.append('Authorization', 'Bearer ' + token);
      //alert("token: " + JSON.stringify(this.contentHeader));
    }).catch(error => {
      console.log(error);
    });
    this.imageRetries = 0;
    this.isImage = {};
    this.url = [];
    this.test = true;
    let session = new Date();
    let dontCache = session.getTime();
    this.xxx = dontCache;
    this.phoneContacts =[];
    //this.phoneContacts2 =[];

    this.defaultImage = 'assets/img/avatar3.png';
    this.offset = 100;
    this.queryText = '';
    this.isContact = false;
    //TODO set formID
    //this.storage.set('groupContacts', []);
    this.getContacts();
	}

  getContacts(){
    //alert(this.pageType);
    let options = {
      multiple: true,
      hasPhoneNumber: true,
      contactFields: ['displayName']
    };
    this.platform.ready().then(() => {
      //Contacts.find(['*'], options).then((contact) => {
      Contacts.find(['phoneNumbers','displayName','emails'], options).then((contact) => {
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

        this.uploadPhonebookContacts();

        /*this.xContacts = JSON.stringify(contact[1]);
         this.xxContacts = JSON.stringify(contact[1]['phoneNumbers'][0].value);
         this.xxxContacts = JSON.stringify(contact[1]['emails'][0].value);*/
        //console.log(this.phoneContacts); // This shows the complete object.
        //console.log(this.phoneContacts.displayName); // it says undefined :( IDK why....
      }, (err) => {console.log("error: " + err)})

    });
  }

  uploadPhonebookContacts(){
    alert(JSON.stringify(this.contentHeader));
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
    //alert(JSON.stringify(data));
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
    //alert("sending SMS");
    //alert(phoneNumber);
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
          //alert("success");
        },(e)=>{
          //alert("failed: " + e);
        });
    });


  }


  back(){
    this.nav.pop();
    //this.nav.setRoot(SchedulePage);
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

  pressEvent(e, contact) {
    alert("rawId: " + contact["rawId"]);

    this.isContact = true;
    if(!this.groupContactsIndex[contact["rawId"]]){
      this.groupContacts.push(contact);
      this.groupContactsIndex[contact["rawId"]]= true;
      alert("onPress: " + JSON.stringify(this.groupContacts));
      alert("groupContactsIndex: " + JSON.stringify(this.groupContactsIndex));
      //alert("index: " + this.groupContactsIndex.indexOf(contact["rawId"]));
    } else {
      alert("DUPLICATE");
    }
  }

  tapEvent(e, contact) {
    alert("rawId: " + contact["rawId"]);

    this.isContact = true;
    if(!this.groupContactsIndex[contact["rawId"]]){
      this.groupContacts.push(contact);
      this.groupContactsIndex[contact["rawId"]]= true;
      alert("onPress: " + JSON.stringify(this.groupContacts));
      alert("groupContactsIndex: " + JSON.stringify(this.groupContactsIndex));
      //alert("index: " + this.groupContactsIndex.indexOf(contact["rawId"]));
    } else {
      alert("DUPLICATE");
    }
  }
  removeContact(contactIndex, contact){
    alert("remove: " + contactIndex);
    alert("groupContactsIndex: " + this.groupContactsIndex[contact["rawId"]]);
    this.groupContacts.splice(contactIndex, 1);
    this.groupContactsIndex[contact["rawId"]]= false;
    /*if(this.groupContacts.length === -1){
      this.isContact = false;
      alert("empty");
    }*/
  }
  groupContactsInfo(){
    alert("groupContactsInfo");
    let tmpGroup = {};
    let formID = this.unixID();
    tmpGroup[formID] = {};
    tmpGroup[formID]["contacts"] = {};
    tmpGroup[formID]["contacts"] = this.groupContacts;
    console.log("contact ****************************************");
    console.log(JSON.stringify(tmpGroup));
    console.log("contact ****************************************");
    this.storage.set(formID, tmpGroup);
    //this._app.getRootNav().push(GroupPage, {formID: "111"});
    this.nav.push(GroupPage, {formID: formID});
  }

  unixID() {
    let d = new Date();
    let n = d.getTime();
    return n.toString();
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
