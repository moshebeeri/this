/**
 * Created by roilandshut on 13/03/2017.
 */
import store from "react-native-simple-store";
import Timer from "./LogTimer";
import * as actions from "../reducers/reducerActions";
import EntityUtils from "../utils/createEntity";
import * as errors from './Errors'
import PhoneUtils from "../utils/phoneUtils";
import serverRequestHandler from './serverRequestHandler';

let entityUtils = new EntityUtils();
let timer = new Timer();

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
                    if (response.status === '401' || response.status === 401) {
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
                if (response.status === '401' || response.status === 401) {
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
                let normalizeFunction = PhoneUtils.clean_phone_number.bind(this);
                contacts.forEach(function (element) {
                    contacsMap.set(normalizeFunction(element.phoneNumbers[0].number), element);
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
            });
            resolve(fullContacts);
        })
    }

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
                if (response.status === '401' || response.status === 401) {
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
                });
                if (response.status === '401' || response.status === 401) {
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
                let phoneNumber = PhoneUtils.clean_phone_number(phone);
                const response = await fetch(`${server_host}/api/users/get/user/by/phone/` + 972 + '/' + phoneNumber, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token,
                    }
                });
                if (response.status === '401' || response.status === 401) {
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
                if (response.status === '401' || response.status === 401) {
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
                });
                if (response.status === '401' || response.status === 401) {
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
                if (response.status === '401' || response.status === 401) {
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

    saveUserDetails(user, id, token, dispatch) {
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
                if (response.status === '401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                timer.logTime(from, new Date(), 'user', 'update');
                resolve(true);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    async setUser(dispatch, token) {
        try {
            let user = await this.getUser(token);
            dispatch({
                type: actions.UPSERT_SINGLE_USER,
                item: user
            })
            dispatch({
                type: actions.SET_USER,
                user: user
            })
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }

    testError() {
        return new Promise(async (resolve, reject) => {
            try {
                fetch(`${server_host}/api/users/error/test`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                    }
                }).then(
                    response => {
                        const status = parseInt(response.status);
                        let statusValidate = serverRequestHandler.handleServerRequest(status);
                        if (statusValidate) {
                            return reject(statusValidate);
                        }
                        return resolve(true)
                    }
                ).catch(
                    err => {
                        if (err.message === 'Network request failed') {
                            return reject(errors.NETWORK_ERROR);
                        }
                        return reject(errors.UNHANDLED_ERROR)
                    }
                );
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }
}

export default UserApi;