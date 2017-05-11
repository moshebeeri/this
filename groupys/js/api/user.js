/**
 * Created by roilandshut on 13/03/2017.
 */
import store from 'react-native-simple-store';

class UserApi
{
    getUser() {
        return new Promise(async(resolve, reject) => {
            try {
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/users/me/`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token,
                    }

                })
                if (response.status == '401') {
                    reject(error);
                    return;
                }

                let responseData = await response.json();
                store.save('user_id', responseData._id);

                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })


    }


    getUserFollowers() {
        return new Promise(async(resolve, reject) => {
            try {
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/profiles/follow/followers/0/1000`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token,
                    }

                })
                if (response.status == '401') {
                    reject(error);
                    return;
                }

                let responseData = await response.json();

                let fullContacts = await this.getFullContacts(responseData)
                resolve(fullContacts);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })


    }

    async getFullContacts(contactPhones){
        return new Promise(async(resolve, reject) => {
            let contacsMap = new Map();
            let contacts = await store.get('all-contacts');
            contacts = JSON.parse(contacts);
            if(contacts) {
                let normalizeFuncrion = this.clean_phone_number.bind(this);
                contacts.forEach(function (element) {
                    contacsMap.set(normalizeFuncrion(element.phoneNumbers[0].number), element);
                });
            }
            let fullContacts = contactPhones.map(function(contact){
                let phoneContact = contacsMap.get(contact.phone);
                if(phoneContact){
                    return {
                        name: phoneContact.givenName + ' ' + phoneContact.familyName,
                        phone: contact.phone,
                        _id: contact._id
                    };
                }

                return {
                    phone: contact.phone,
                    _id: contact._id
                };
            })
            resolve(fullContacts);
        })
    }

    clean_phone_number(number){
        // remove all non digits, and then remove 0 if it is the first digit
        return number.replace(/\D/g, '').replace(/^0/,'')
    };


    like(id){
        return new Promise(async(resolve, reject) => {
            try {
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/users/like/`+id, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token,
                    }

                })
                if (response.status == '401') {
                    reject(error);
                    return;
                }

                let responseData = await response.json();

                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })
    }
}

export default UserApi;