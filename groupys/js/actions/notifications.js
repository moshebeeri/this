import NotificationApi from "../api/notification";
import * as actions from "../reducers/reducerActions";
import ActionLogger from './ActionLogger'
import  handler from './ErrorHandler'

let notificationApi = new NotificationApi();
let logger = new ActionLogger();

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
            handler.handleError(error, dispatch)
            logger.actionFailed('notification-onEndReached')
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
            handler.handleError(error, dispatch)
            logger.actionFailed('notification-setTopNotification')
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
            handler.handleError(error, dispatch)
            logger.actionFailed('notification-readNotification')
        }
    }
}

export function doNotification(notificationId, type) {
    return function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            notificationApi.doNotificationAction(token, notificationId, type);
            dispatch({
                type: actions.EXECUTE_NOTIFICATION_ACTION,
                id: notificationId,
            });
        } catch (error) {
            handler.handleError(error, dispatch)
            logger.actionFailed('notification-doNotification')
        }
    }
}

async function updateNotification(dispatch, token, user, notifications) {
    try {
        let skip = 0;
        if (notifications.length >= 10) {
            skip = notifications.length - 1;
        }
        let response = await notificationApi.getAll(token, user, skip, 10);
        dispatch({
            type: actions.SET_NOTIFICATION,
            notifications: response,
        });
    } catch (error) {
        handler.handleError(error, dispatch)
        logger.actionFailed('notification-updateNotification')
    }
}



export default {
    updateNotification
}



