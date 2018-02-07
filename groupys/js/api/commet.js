import Timer from "./LogTimer";
import * as errors from './Errors'

let timer = new Timer();

class CommentApi {
    createComment(group, instance, comment, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                let request = {
                    entities: [
                        {group: group},
                        {instance: instance},
                    ]
                    ,
                    message: comment
                };
                const response = await fetch(`${server_host}/api/comments/`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(request)
                });
                if (response.status === '401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'comments', '/');
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        });
    }

    createGlobalComment(entities, comment, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                let request = {
                    message: comment
                };
                request.entities = entities;
                const response = await fetch(`${server_host}/api/comments/`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(request)
                });
                if (response.status === '401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'comments', '/');
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        });
    }

    getComment(entities, token, skip) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                let request = {};
                request.entities = entities;
                const response = await fetch(`${server_host}/api/comments/find/` + skip + '/' + 10, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(request)
                });
                if (response.status === '401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'comments', '/skip/limit');
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        });
    }

    getGroupComments(group, token, id, direction) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/comments//group/chat/scroll/` + group._id + '/' + id + '/' + direction, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                })
                if (response.status === '401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                timer.logTime(from, new Date(), 'comments', 'api/comments/group/chat/');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        });
    }

    getInstanceGroupComments(group, instance, size, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                let request = {
                    entities: [
                        {group: group},
                        {instance: instance},
                    ]
                };
                const response = await fetch(`${server_host}/api/comments/find/` + size + '/' + 10, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(request)
                });
                if (response.status === '401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'comments', '/skip/limit');
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        });
    }
}

export default CommentApi;