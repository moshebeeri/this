/**
 * Created by roilandshut on 29/03/2017.
 */

let Contacts = require('react-native-contacts');
let store = require('react-native-simple-store');
import * as errors from './Errors'
class ContactsApi {
    async addAllContacts(token, userId) {
        Contacts.getAll((err, contacts) => {
            if (err && err.type === 'permissionDenied') {
                return;
            }
            contacts = contacts.filter(function (element) {
                return element.phoneNumbers.length > 0;
            });
           if(token) {
               this.updateServer(token, userId, contacts)

           }
        })
    };

    async updateContacts(token, userId, currentContacts) {
        Contacts.getAll((err, contacts) => {
            if (err && err.type === 'permissionDenied') {
                return;
            }
            let newContacts = [];
            contacts = contacts.filter(function (element) {
                return element.phoneNumbers.length > 0;
            });
            let contacsMap = new Map();
            contacts.forEach(function (element) {
                contacsMap.set(element.phoneNumbers[0].number, element);
            });
            contacts.forEach(function (element) {
                if (!contacsMap.get(element.phoneNumbers[0].number)) {
                    newContacts.push(element);
                    currentContacts.push(element);
                }
            });
            if (newContacts.length > 0) {

                this.updateServer(token, userId, currentContacts);
            }

        })
    }

    async updateServer(token, userId, contacts) {
        let phoneBooks = {};
        phoneBooks.userId = userId;
        phoneBooks.phonebook = contacts.map(contact => {
            let phone = {};
            if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
                phone.normalized_number = contact.phoneNumbers[0].number;
                phone.number = contact.phoneNumbers[0].number;
            }
            if (contact.emailAddresses && contact.emailAddresses.length > 0) {
                phone.email = contact.emailAddresses[0].email;
            }
            phone.name = contact.givenName + ' ' + contact.familyName;
            return phone;
        });
        let json = JSON.stringify(phoneBooks);
       // console.log('Sending phone book' + json);
        try {
            let response = await fetch(`${server_host}/api/users/phonebookNew`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': 'Bearer ' + token,
                },
                body: json
            });
            if (response.status ==='401' || response.status === 401) {
                reject(errors.UN_AUTHOTIZED_ACCESS);
                return;

            }

            store.save('all-contacts', contacts);
        } catch (error) {
           // reject(errors.NETWORK_ERROR);
        }
    }

    async syncContacts() {
        return new Promise(async (resolve, reject) => {
            let contacts = await store.get('all-contacts');
            if (contacts) {
                contacts = JSON.parse(contacts);
            }
            let token = await store.get('token');
            let userId = await store.get('user_id');
            if (token && userId) {
                try {
                    if (contacts && contacts.length > 0) {
                        this.updateContacts(token, userId, contacts);
                        return
                    }
                    this.addAllContacts(token, userId);
                    resolve(true);
                }
                catch (error) {
                    reject(errors.NETWORK_ERROR);
                }
            }
        })
    }
}

export default ContactsApi;