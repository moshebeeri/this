/**
 * Created by roilandshut on 13/03/2017.
 */
import store from "react-native-simple-store";
import Timer from "./LogTimer";
import * as actions from "../reducers/reducerActions";
import EntityUtils from "../utils/createEntity";
let entityUtils = new EntityUtils();
let timer = new Timer();
import * as errors from './Errors'
class UserApi {
    getUser(token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                if (token) {
                    const response = await fetch(`${server_host}/api/users/me/`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json;charset=utf-8',
                            'Authorization': 'Bearer ' + token,
                        }
                    })
                    if (response.status === '401') {
                        reject(error);
                        return;
                    }
                    let responseData = await response.json();
                    timer.logTime(from, new Date(), 'users', 'me');
                    resolve(responseData);
                } else {
                    reject('no token');
                }
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    getUserById(token, id) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                if (token) {
                    const response = await fetch(`${server_host}/api/users/` + id, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json;charset=utf-8',
                            'Authorization': 'Bearer ' + token,
                        }
                    })
                    if (response.status ==='401' || response.status === 401) {
                        reject(errors.UN_AUTHOTIZED_ACCESS);
                        return;
                    }
                    let responseData = await response.json();
                    timer.logTime(from, new Date(), 'users', 'me');
                    resolve(responseData);
                } else {
                    reject('no token');
                }
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    getUserFollowers(token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/profiles/follow/followers/0/1000`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token,
                    }
                })
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'profiles', 'follow/followers')
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    async getFullContacts(contactPhones) {
        return new Promise(async (resolve, reject) => {
            let contacsMap = new Map();
            let contacts = await store.get('all-contacts');
            contacts = JSON.parse(contacts);
            if (contacts) {
                let normalizeFuncrion = this.clean_phone_number.bind(this);
                contacts.forEach(function (element) {
                    contacsMap.set(normalizeFuncrion(element.phoneNumbers[0].number), element);
                });
            }
            let fullContacts = contactPhones.map(function (contact) {
                let phoneContact = contacsMap.get(contact.phone_number);
                if (phoneContact) {
                    return {
                        name: phoneContact.givenName + ' ' + phoneContact.familyName,
                        phone: contact.phone_number,
                        _id: contact._id
                    };
                }
                return {
                    phone: contact.phone_number,
                    _id: contact._id
                };
            })
            resolve(fullContacts);
        })
    }

    clean_phone_number(number) {
        // remove all non digits, and then remove 0 if it is the first digit
        return number.replace(/\D/g, '').replace(/^0/, '')
    };

    like(id, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/users/like/` + id, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token,
                    }
                })
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                timer.logTime(from, new Date(), 'users', 'like');
                resolve(true);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    unlike(id, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/users/like/` + id, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token,
                    }
                })
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                timer.logTime(from, new Date(), 'users', 'unlike');
                resolve(true);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    getUserByPhone(phone) {
        return new Promise(async (resolve, reject) => {
            try {
                let token = await store.get('token');
                let from = new Date();
                let phoneNumber = this.clean_phone_number(phone);
                const response = await fetch(`${server_host}/api/users/get/user/by/phone/` + 972 + '/' + phoneNumber, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token,
                    }
                })
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                let responseData = await response.json();
                resolve(responseData);
                timer.logTime(from, new Date(), 'users', 'get/user/by/phone/')
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    setUserRole(user, business, role) {
        return new Promise(async (resolve, reject) => {
            try {
                let token = await store.get('token');
                let from = new Date();
                const response = await fetch(`${server_host}/api/users/role/` + user + '/' + role + '/' + business, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token,
                    }
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'users', 'get/user/by/phone/');
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    removeUserRole(user, business) {
        return new Promise(async (resolve, reject) => {
            try {
                let token = await store.get('token');
                let from = new Date();
                const response = await fetch(`${server_host}/api/users/role/` + user + '/' + business, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token,
                    }
                })
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'users', 'get/user/by/phone/');
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    getBusinessUsers(business, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/users/roles/` + business + '/' + 0 + '/' + 100, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token,
                    }
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'users', 'get/user/by/phone/');
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    saveUserDetails(user, id,token,dispatch) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('start updating')
               let from = new Date();
                const response = await fetch(`${server_host}/api/users/`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(user)
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }


                timer.logTime(from, new Date(), 'user', 'update');
                if (user.image) {
                    let imagePath = user.image.uri;
                    if(!imagePath){
                        imagePath = user.image.path;
                    }
                   // entityUtils.doUpload(imagePath, user.image.mime, token, callback, 'users', user);
                }
                resolve(true);

            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

   async setUser(dispatch,token){
       try{
          let user = await this.getUser(token);
           dispatch({
               type: actions.UPSERT_SINGLE_USER,
               item: user
           })
           dispatch({
               type: actions.SET_USER,
               user: user
           })
       }catch (error){
           dispatch({
               type: actions.NETWORK_IS_OFFLINE,
           });
       }
    }

}

export default UserApi;