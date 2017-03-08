
var Contacts = require('react-native-contacts');
var store =   require ('react-native-simple-store');


function addAllContacts(token,userId){
    Contacts.getAll((err, contacts) => {

        if(err && err.type === 'permissionDenied'){
            return;
        }
        var contactsMap = new Map();
        contacts.forEach(function (element) {
            contactsMap.set(element.recordID,element);
        })
        store.save('contacts', contactsMap);
        updateServer(token,userId,contacts)

    })
}


function updateContacts(token,userId,currentContacts) {
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
            updateServer(token,userId,newContacts)
        }

    })

}

function updateServer(token,userId,contacts){

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
        phone.name = contact.givenName + ' ' + +contact.familyName;

        return phone;

    })

    var json = JSON.stringify(phoneBooks);
    fetch(`${server_host}/api/phonebooks` , {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body:  json

        }

    ).then((

        response) => response.json())
        .then((responseData) => {

            console.log(responseData);

        }).catch(function (error) {

        console.log('There has been a problem with your fetch operation: ' + error.message);



    });
}

module.exports = function(token,userId) {

    store.get('contacts').then( contacts =>
        {
           if(contacts.length > 0 ){
               updateContacts(token,userId,contacts)
               return
           }
            addAllContacts(token,userId);
        }
    );

}
