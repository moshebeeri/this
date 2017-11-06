import Timer from "./LogTimer";

let timer = new Timer();

class NotificationApi {
    getAll(token, user, skip, limit) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/notifications/` + user._id + '/' + skip + '/' + limit, {
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
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'notifications', 'my');
                resolve(responseData);
            }
            catch (error) {
                reject(error);
            }
        })
    }

    readNotification(token, notification_id) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/notifications/read/` + notification_id, {
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
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'notifications', 'read');
                resolve(responseData);
            }
            catch (error) {
                reject(error);
            }
        })
    }

    doNotificationAction(token, notification_id) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/notifications/action/` + notification_id, {
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
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'notifications', 'read');
                resolve(responseData);
            }
            catch (error) {
                reject(error);
            }
        })
    }
}

export default NotificationApi;