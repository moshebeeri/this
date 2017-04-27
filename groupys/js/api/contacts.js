/**
 * Created by roilandshut on 29/03/2017.
 */

var Contacts = require('react-native-contacts');
var store =   require ('react-native-simple-store');


class ContactsApi
{



    async addAllContacts(token,userId){
        Contacts.getAll((err, contacts) => {

            if(err && err.type === 'permissionDenied'){
                return;
            }
            var contactsMap = new Map();
            contacts.forEach(function (element) {
                contactsMap.set(element.recordID,element);
            })
            store.save('contacts', contactsMap);
            this.updateServer(token,userId,contacts)

        })
}


    async updateContacts(token,userId,currentContacts) {
        Contacts.getAll((err, contacts) => {

            if(err && err.type === 'permissionDenied'){
                return;
            }

            var newContacts = [];
            contacts.forEach(function (element) {
                if(!currentContacts.get(element.recordID)){
                    newContacts.push(element);
                    currentContacts.put(element.recordID,element);
                }

            })

            if(newContacts.length > 0 ){
                store.save('contacts', currentContacts);
                this.updateServer(token,userId,newContacts)
            }

    })


    }

    async updateServer(token,userId,contacts){

        var phoneBooks = {};
        phoneBooks.userId = userId;
        phoneBooks.phonebook = contacts.map(contact => {
            var phone = {};
            if(contact.phoneNumbers && contact.phoneNumbers.length > 0){
                phone.normalized_number = contact.phoneNumbers[0].number;
                phone.number = contact.phoneNumbers[0].number;
            }
            if(contact.emailAddresses &&  contact.emailAddresses.length > 0){
                phone.email = contact.emailAddresses[0].email;
            }
            phone.name = contact.givenName + ' ' +contact.familyName;

            return phone;

        });

        var json = JSON.stringify(phoneBooks);
        try {
            let response = await fetch(`${server_host}/api/users/phonebook`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': 'Bearer ' + token,
                },
                body: json

            });
        }catch (error){
            console.log(error);
        }
    }

    async syncContacts() {
        return new Promise(async(resolve, reject) => {

            let contacts = await store.get('contacts');
            let token = await store.get('token');
            let userId = await store.get('user_id');
            if (token && userId) {
                try {

                    if (contacts && contacts.length > 0) {
                        this.updateContacts(token, userId, contacts)
                        return
                    }
                    this.addAllContacts(token, userId);

                    resolve(true);
                }
                catch (error) {

                    console.log('There has been a problem with your fetch operation: ' + error.message);
                    reject(error);
                }
            }
        })


    }
}

export default ContactsApi;