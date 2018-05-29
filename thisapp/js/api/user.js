/**
 * Created by roilandshut on 13/03/2017.
 */
import store from "react-native-simple-store";
import Timer from "./LogTimer";
import * as actions from "../reducers/reducerActions";
import EntityUtils from "../utils/createEntity";
import PhoneUtils from "../utils/phoneUtils";
import CallingCallUtils from '../utils/LocalToCallingCode'
import serverRequestHandler from './serverRequestHandler';

let entityUtils = new EntityUtils();
let timer = new Timer();

class UserApi {
    noTokenReject() {
        return new Promise(async (resolve, reject) => {
            reject('no token');
        })
    }

    getUser(token) {
        if (!token) return this.noTokenReject();
        return serverRequestHandler.fetch_handler(`${server_host}/api/users/me`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            }
        }, 'user', 'users/me');
    }

    getServerVersion(token) {
        if (!token) return this.noTokenReject();
        return serverRequestHandler.fetch_handler(`${server_host}/api/users/server/version`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            }
        }, 'user', 'users/me');
    }

    getUserById(token, id) {
        if (!token) return this.noTokenReject();
        return serverRequestHandler.fetch_handler(`${server_host}/api/users/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            }
        }, 'user', 'users/:id');
    }

    //TODO: pagination
    getUserFollowers(token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/profiles/follow/followers/0/1000`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            }
        }, 'user', 'profiles/follow/followers');
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
        return serverRequestHandler.fetch_handler(`${server_host}/api/users/like/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            }
        }, 'user', 'like/:id', 'BOOLEAN')
    }

    unlike(id, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/users/like/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            }
        }, 'user', 'delete /like/:id', 'BOOLEAN')
    }

    async getUserByPhone(phone) {
        let token = await store.get('token');
        let callingCode = await CallingCallUtils.getCallingCode();
        let phoneNumber = PhoneUtils.clean_phone_number(phone);
        return serverRequestHandler.fetch_handler(`${server_host}/api/users/get/user/by/phone/${callingCode}/${phoneNumber}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            }
        }, 'user', 'get/user/by/phone');
    }

    async setUserRole(user, business, role, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/users/role/${user}/${role}/${business}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            }
        }, 'user', 'users/role/:user/:role/:business');
    }

    async removeUserRole(user, business, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/users/role/${user}/${business}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            }
        }, 'user', 'delete /role/:user/:role/:business');
    }

    //TODO: pagination
    getBusinessUsers(business, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/users/roles/${business}/0/100`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            }
        }, 'user', 'roles/:business');
    }

    saveUserDetails(user, id, token, dispatch) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/users`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(user)
        }, 'user', 'update user', 'BOOLEAN');
    }

    async setUser(dispatch, token) {
        try {
            let user = await UserApi.getUser(token);
            dispatch({
                type: actions.UPSERT_SINGLE_USER,
                item: user
            });
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
}

export default UserApi;