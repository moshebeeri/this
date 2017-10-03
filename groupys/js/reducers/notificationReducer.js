const initialState = {notification: [], update: false};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";

export default function notification(state = initialState, action) {
    console.log(action.type);
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.notification
        };
    }
    let imutableState = {...state};
    let currentNotifications = imutableState.notification;
    switch (action.type) {
        case actions.SET_NOTIFICATION :
            if (action.notifications.length > 0) {
                action.notifications.forEach(notification => {
                    notification.key = notification._id;
                    currentNotifications.push(notification)
                });
                return {
                    ...state,
                    notification: currentNotifications,
                };
            }
            return state;
        case actions.READ_NOTIFICATION:
            let notificationRead = currentNotifications.filter(function (notification) {
                return notification._id == action.id
            });
            if (notificationRead.length > 0) {
                notificationRead[0].read = true;
            }
            return {
                ...state,
                update: !state.update,
                notification: currentNotifications,
            };
        case actions.EXECUTE_NOTIFICATION_ACTION:
            let notification = currentNotifications.filter(function (notification) {
                return notification._id == action.id
            });
            if (notification.length > 0) {
                notification[0].action = true;
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