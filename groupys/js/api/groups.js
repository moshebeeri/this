/**
 * Created by roilandshut on 10/05/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */
import store from "react-native-simple-store";
import EntityUtils from "../utils/createEntity";
import Timer from "./LogTimer";

let entityUtils = new EntityUtils();
let timer = new Timer();

class GroupsApi {
    createGroup(group, callbackFunction, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/groups/`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(group)
                });
                if (response.status ==='401' || response.status ==='500') {
                    reject(response);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'groups', '/');
                if (group.groupUsers) {
                    this.addUsersToGroup(group, responseData);
                }
                if (group.image) {
                    entityUtils.doUpload(group.image.uri, group.image.mime, token, callbackFunction, 'groups', responseData);
                } else {
                    callbackFunction(responseData);
                }
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })
    }

    addUsersToGroup(group, responseData) {
        let addGroupsUsers = this.addUserToGroup.bind(this);
        group.groupUsers.forEach(function (user) {
            addGroupsUsers(user._id, responseData._id);
        });
    }

    addUserToGroup(user, group) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/groups/add/user/${user}/${group}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                });
                if (response.status ==='401' || response.status ==='500') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), 'groups', '/add/user');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })
    }

    inviteUser(user, group) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/groups/invite/ask/${group}/${user}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                });
                if (response.status ==='401' || response.status ==='500') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), 'groups', 'invite/ask');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })
    }

    acceptInvatation(group, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/groups/invite/approve/` + group._id, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), 'groups', 'invite/approve');
                resolve(true);
            }
            catch (error) {
                reject(error);
            }
        })
    }

    getAll(token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/groups/user/follow/0/100`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), 'groups', '/user/follow');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })
    }

    getByBusinessId(bid, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/groups/following/` + bid + `/0/100`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), 'groups', '/user/follow');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })
    }

    touch(groupid, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/groups/touch/${groupid}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), 'groups', 'touch');
                resolve(true)
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })
    }

    meesage(groupid, message, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                let json = {
                    message: message
                };
                const response = await fetch(`${server_host}/api/groups/message/${groupid}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(json)
                });
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), 'groups', 'meesage');
                resolve(true)
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation');
                reject('Failed to deliver message');
            }
        })
    }
}

export default GroupsApi;