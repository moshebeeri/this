import Timer from "./LogTimer";

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
                        {post: instance},
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
                if (response.status === '401') {
                    reject(response);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'comments', '/');
                resolve(responseData);
            }
            catch (error) {

                // console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
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
                if (response.status === '401') {
                    reject(response);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'comments', '/');
                resolve(responseData);
            }
            catch (error) {

                // console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
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
                if (response.status === '401') {
                    reject(response);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'comments', '/skip/limit');
                resolve(responseData);
            }
            catch (error) {

                // console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        });
    }

    getGroupComments(group, token, skip, limit) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/comments/group/chat/` + group._id + '/' + skip + '/' + limit, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                })
                if (response.status === '401') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), 'comments', 'api/comments/group/chat/');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {

                // console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
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
                if (response.status === '401') {
                    reject(response);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'comments', '/skip/limit');
                resolve(responseData);
            }
            catch (error) {
                reject(error);
            }
        });
    }
}

export default CommentApi;