import * as types from '../../sega/segaActions';
import FCM from 'react-native-fcm';
class NotificationHandler {
    constructor() {
    }

    handleFrontNotification(notification, state, dispatch) {
        if(!notification){
            return;
        }
        let token = state.authentication.token;
        if(token) {
            const user = state.user.user;
            const notifications = state.notification.notification;
            // FCM.getBadgeNumber().then(number => FCM.setBadgeNumber(0));
            switch (notification.model) {
                case 'instance':
                    dispatch({
                        type: types.PROMOTION_NOTIFICATION,
                        notificationId: notification.notificationId,
                        instanceId: notification.entity,
                        token: token,
                    })
                    break;
                case 'group':
                case 'business':
                    dispatch({
                        type: types.ADD_GENERAL_NOTIFICATION,
                        notificationId: notification.notificationId,
                        token: token,
                    });
                    this.setNotifications(notifications, dispatch, user, token);
                    break;
                case 'comment':
                    dispatch({
                        type: types.ADD_COMMENT_NOTIFICATION,
                        notificationId: notification.notificationId,
                        token: token,
                    });
                    break;
                default:
                    if (notification.notificationId) {
                        dispatch({
                            type: types.ADD_GENERAL_NOTIFICATION,
                            notificationId: notification.notificationId,
                            token: token,
                        });
                        this.setNotifications(notifications, dispatch, user, token);
                    }
                    break;
            }
        }
    }


    setNotifications(notifications, dispatch, user, token,) {
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

    handleBacKNotification(notification, actions, navigation, state, dispatch) {
        if(!notification){
            return;
        }
        let token = state.authentication.token;
        const user = state.user.user;
        const notifications = state.notification.notification;
        FCM.getBadgeNumber().then(number => FCM.setBadgeNumber(0));
        switch (notification.model) {
            case 'instance':
                actions.showPromotionPopup(notification.entity, notification.notificationId);
                this.setNotifications(notifications, dispatch, user, token);
                break;
            case 'group':
                if (notification.note === "ask_invite") {
                    actions.showInviteGroupPopup(notification.entity, notification.actor_user, notification.notificationId);
                } else {
                    actions.showGroupPopup(notification.entity, notification.notificationId, notification.title, notification.action);
                }
                this.setNotifications(notifications, dispatch, user, token);
                break;
            case 'business':
                actions.showBusinessPopup(notification.entity, notification.notificationId, notification.title, notification.action);
                this.setNotifications(notifications, dispatch, user, token);
                break;
            case 'comment':
                actions.redirectToChatGroup(notification.actor_group, notification.notificationId, notification.action, navigation);
                break;
            default:
                if (notification && notification.title) {
                    actions.showGenericPopup(notification.title, notification.notificationId, notification.action);
                    this.setNotifications(notifications, dispatch, user, token);
                }
                break;
        }
    }
}

const notificatiםnHandler = new NotificationHandler();
export default notificatiםnHandler;