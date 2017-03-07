
var Contacts = require('react-native-contacts');
var store =   require ('react-native-simple-store');


function addAllContacts(token){
    Contacts.getAll((err, contacts) => {

        if(err && err.type === 'permissionDenied'){
            return;
        }
        var contactsMap = new Map();
        contacts.forEach(function (element) {
            contactsMap.set(element.recordID,element);
        })
        store.save('contacts', contactsMap);
        updateServer(token,contacts)

    })
}


function updateContacts(token,currentContacts) {
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
            updateServer(token,newContacts)
        }

    })

}

function updateServer(token,contacts){

}

module.exports = function(token) {

    store.get('contacts').then( contacts =>
        {
           if(contacts.length > 0 ){
               updateContacts(contacts)
               return
           }
            addAllContacts(token);
        }
    );

}
