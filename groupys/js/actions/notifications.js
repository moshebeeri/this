import NotificationApi from "../api/notification";
import * as actions from "../reducers/reducerActions";
import ActionLogger from './ActionLogger'
import  handler from './ErrorHandler'
import * as types from '../sega/segaActions';

let notificationApi = new NotificationApi();
let logger = new ActionLogger();

export function setTopNotification() {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            if(user && token) {
                let response = await notificationApi.getAll(token, user, 0, 10);
                dispatch({
                    type: actions.SET_TOP_NOTIFICATION,
                    notifications: response,
                });
            }
            handler.handleSuccses(getState(),dispatch)
        } catch (error) {
            handler.handleError(error, dispatch,'notification-setTopNotification')
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
            handler.handleSuccses(getState(),dispatch)
        } catch (error) {
            handler.handleError(error, dispatch,'notification-readNotification')
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
            })
            handler.handleSuccses(getState(),dispatch)
        } catch (error) {
            handler.handleError(error, dispatch,'notification-doNotification')
            logger.actionFailed('notification-doNotification')
        }
    }
}

async function updateNotification(dispatch, token, user, notifications) {
    try {
        let skip = 0;
        if (notifications) {
            skip = notifications.length;
        }
        let response = await notificationApi.getAll(token, user, skip, 10);
        if(response.length > 0) {
            dispatch({
                type: actions.SET_NOTIFICATION,
                notifications: response,
            });
        }

    } catch (error) {
        handler.handleError(error, dispatch,'notification-updateNotification')
        logger.actionFailed('notification-updateNotification')
    }
}

export function onEndReached() {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            const notifications = getState().notification.notification;
            if(user && token) {
                let skip = 0;
                if (notifications) {
                    skip = notifications.length;
                }
                dispatch({
                    type: types.SAVE_NOTIFICATION_REQUEST,
                    user: user,
                    skip: skip,
                    token: token,
                    limit: 20,
                });
            }
            handler.handleSuccses(getState(),dispatch)
        } catch (error) {
            handler.handleError(error, dispatch,'notification-onEndReached')
            logger.actionFailed('notification-onEndReached')
        }
    }
}

export function setNotification(response){
    return {
        type: actions.SET_NOTIFICATION,
        notifications: response,
    }
}






export default {
    updateNotification
}



