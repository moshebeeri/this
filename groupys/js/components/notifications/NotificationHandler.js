import * as types from '../../sega/segaActions';

class NotificationHandler {
    constructor() {
    }

    handleFrontNotification(notification, state, dispatch) {
        let token = state.authentication.token;
        switch (notification.model) {
            case 'instance':
                dispatch({
                    type: types.PROMOTION_NOTIFICATION,
                    notificationId: notif.notificationId,
                    instanceId: notif._id,
                    token: token,
                })
                FCM.getBadgeNumber().then(number => FCM.setBadgeNumber(number - 1));
                break;
            case 'group':
            case 'business':
                dispatch({
                    type: types.ADD_GENERAL_NOTIFICATION,
                    notificationId: notification.notificationId,
                    token: token,
                });
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
                }
                break;
        }
    }

    handleBacKNotification(notification, actions,navigation) {
        switch (notification.model) {
            case 'instance':
                actions.showPromotionPopup(notification._id, notification.notificationId);
                FCM.getBadgeNumber().then(number => FCM.setBadgeNumber(number - 1));
                break;
            case 'group':
                if (notification.note === "ask_invite") {
                    actions.showInviteGroupPopup(notification._id, notification.actor_user, notification.notificationId);
                } else {
                    actions.showGroupPopup(notification._id, notification.notificationId, notification.title, notification.action);
                }
                FCM.getBadgeNumber().then(number => FCM.setBadgeNumber(number - 1));
                break;
            case 'business':
                actions.showBusinessPopup(notification._id, notification.notificationId, notification.title, notification.action);
                FCM.getBadgeNumber().then(number => FCM.setBadgeNumber(number - 1));
                break;
            case 'comment':
                actions.redirectToChatGroup(notification.actor_group, notification.notificationId, notification.action, navigation);
                break;
            default:
                if (notification && notification.title) {
                    actions.showGenericPopup(notification.title, notification.notificationId, notification.action);
                    FCM.getBadgeNumber().then(number => FCM.setBadgeNumber(number - 1));
                }
                break;
        }
    }
}

const notificatiםnHandler = new NotificationHandler();
export default notificatiםnHandler;