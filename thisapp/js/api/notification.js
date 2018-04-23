import serverRequestHandler from './serverRequestHandler';

class NotificationApi {
    getAll(token, user, skip, limit) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/notifications/${user._id}/${skip}/${limit}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'notifications', '/get');
    }

    readNotification(token, notification_id) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/notifications/read/${notification_id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'notifications', '/read')
    }

    resetBadgeNotification(token) {
        if(token) {
            return serverRequestHandler.fetch_handler(`${server_host}/api/notifications/reset/badge`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': 'Bearer ' + token,
                },
            }, 'notifications', '/reset/badge')
        }
    }

    doNotificationAction(token, notification_id, type) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/notifications/action/${notification_id}/${type}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'notifications', '/action')
    }
}

export default NotificationApi;