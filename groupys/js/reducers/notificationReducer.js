const initialState = {notification: [],notificationId:[], update: false,unreadNotification:0};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";

export default function notification(state = initialState, action) {
    //console.log(action.type);
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.notification
        };
    }
    let imutableState = {...state};
    let currentNotifications = imutableState.notification;
    let currentNotificationsIds = imutableState.notificationId;
    switch (action.type) {
        case actions.SET_NOTIFICATION :
            if (action.notifications && action.notifications.length > 0) {
                let shouldUpdate = imutableState.update;
                action.notifications.forEach(notification => {
                    if(!currentNotificationsIds.includes(notification._id)) {
                        notification.key = notification._id;
                        shouldUpdate = !imutableState.update;
                        currentNotificationsIds.push(notification._id);
                        currentNotifications.push(notification)
                        if(!notification.read){
                            imutableState.unreadNotification = imutableState.unreadNotification +1;
                        }
                    }
                });
                return {
                    ...state,
                    notification: currentNotifications,
                    update:shouldUpdate
                };
            }
            return state;
        case actions.SET_TOP_NOTIFICATION :
            if (action.notifications.length > 0) {
                action.notifications.reverse().forEach(notification => {
                    notification.key = notification._id;
                    if(!currentNotificationsIds.includes(notification._id)) {
                        notification.key = notification._id;
                        currentNotificationsIds.push(notification._id);
                        currentNotifications.unshift(notification)
                    }
                });
                return {
                    ...state,
                    notification: currentNotifications,
                };
            }
            return state;
        case actions.READ_NOTIFICATION:
            let notificationRead = currentNotifications.filter(function (notification) {
                return notification._id === action.id
            });
            if (notificationRead.length > 0) {
                notificationRead[0].read = true;
                imutableState.unreadNotification = imutableState.unreadNotification -1;
            }
            return {
                ...state,
                update: !state.update,
                notification: currentNotifications,
            };
        case actions.EXECUTE_NOTIFICATION_ACTION:
            let executeNotifications = currentNotifications.filter(function (notification) {
                return notification._id === action.id
            });
            if (executeNotifications && executeNotifications.length > 0) {
                executeNotifications[0].actionDone = true;
                executeNotifications[0].read = true;
            }
            return {
                ...state,
                update: !state.update,
                notification: currentNotifications,
            };
        default:
            return state;
    }
};