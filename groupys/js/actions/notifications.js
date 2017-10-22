import NotificationApi from "../api/notification";
import * as actions from "../reducers/reducerActions";

let notificationApi = new NotificationApi();

export function onEndReached() {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            const notifications = getState().notification.notification;
            let skip = 0;
            if (notifications) {
                skip = notifications.length + 1;
            }
            let response = await notificationApi.getAll(token, user, skip, 10);
            dispatch({
                type: actions.SET_NOTIFICATION,
                notifications: response,
            });
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

export function setTopNotification() {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;

            let response = await notificationApi.getAll(token, user, 0, 10);
            dispatch({
                type: actions.SET_TOP_NOTIFICATION,
                notifications: response,
            });
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

export function readNotification(notificationId) {
    return function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            notificationApi.readNotification(token, notificationId);
            dispatch({
                type: actions.READ_NOTIFICATION,
                id: notificationId,
            });
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

export function doNotification(notificationId) {
    return function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            notificationApi.doNotificationAction(token, notificationId);
            dispatch({
                type: actions.EXECUTE_NOTIFICATION_ACTION,
                id: notificationId,
            });
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}


