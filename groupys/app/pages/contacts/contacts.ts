import {Page, NavController} from 'ionic-angular';
import {Contacts} from 'ionic-native';

/*
  Generated class for the ContactsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/contacts/contacts.html',
  providers : [Contacts]
})
export class ContactsPage {
  phoneContacts: Array;
  xContacts: string;
  
  constructor(public nav: NavController, public contacts: Contacts) {
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
	
	let options = {
		multiple: true,
		hasPhoneNumber: true,
		contactFields: ['displayName']
	}
	Contacts.find(['*'], options).then((contact) => {
	  this.phoneContacts = contact; 
      this.xContacts = JSON.stringify(contact[0]);	  
	  console.log(this.phoneContacts); // This shows the complete object.      
	  //console.log(this.phoneContacts.displayName); // it says undefined :( IDK why....
	}, (err) => {console.log("error: " + err)})
  }
}
