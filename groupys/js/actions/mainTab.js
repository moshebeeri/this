import * as actions from "../reducers/reducerActions";
import InstanceApi from "../api/instances";
import CollectionDispatcher from "./collectionDispatcher";
import * as assemblers from "./collectionAssembler";
import NotificationApi from "../api/notification";
import * as groupsActions from './groups'
import GoupApi from "../api/groups";
import BusinessApi from "../api/business";
import UserApi from "../api/user";
import ActionLogger from './ActionLogger';
import handler from './ErrorHandler'
import strings from '../i18n/i18n';

let notificationApi = new NotificationApi();
let instanceApi = new InstanceApi();
let groupApi = new GoupApi();
let userApi = new UserApi();
let businessApi = new BusinessApi();
let logger = new ActionLogger();

export function changeTab(newTab) {
    return function (dispatch, getState) {
        dispatch({
            type: actions.APP_CHANGE_TAB,
            selectedTab: newTab.i
        });
    }
}

export function showFab(showAdd) {
    return function (dispatch, getState) {
        dispatch({
            type: actions.APP_SHOW_ADD_FAB,
            showAdd: showAdd
        });
    }
}

export function showPromotionPopup(instanceId, notificationId) {
    return async function (dispatch, getState) {
        try {
            notificationApi.readNotification(notificationId);
            let instances = getState().instances.instances;
            if (show && !instances[instanceId]) {
                const token = getState().authentication.token;
                let instance = await instanceApi.getInstance(token, instanceId);
                if (instance) {
                    let collectionDispatcher = new CollectionDispatcher();
                    assemblers.disassembler(instance, collectionDispatcher);
                    collectionDispatcher.dispatchEvents(dispatch, updateBusinessCategory, token);
                }
            }
            dispatch({
                type: actions.APP_SHOW_PROMOTION_POPUP,
                showPopup: true,
                instanceId: instanceId,
                notificationId: notificationId
            });
        } catch (error) {
            handler.handleError(error, dispatch, 'showPromotionPopup')
            logger.actionFailed('showPromotionPopup')
        }
    }
}

export function showGenericPopup(notificationTitle, notificationId, notificationAction) {
    return async function (dispatch) {
        try {
            notificationApi.readNotification(notificationId);
            dispatch({
                type: actions.APP_SHOW_GENERAL_POPUP,
                showPopup: true,
                notificationTitle: notificationTitle,
                notificationId: notificationId,
                notificationAction: notificationAction
            });
        } catch (error) {
            handler.handleError(error, dispatch, 'showGenericPopup')
            logger.actionFailed('showGenericPopup')
        }
    }
}

export function showGroupPopup(groupId, notificationId, notificationTitle, notificationAction) {
    return async function (dispatch, getState) {
        try {
            notificationApi.readNotification(notificationId);
            let groups = getState().groups.groups;
            let group = groups[groupId];
            if (!group) {
                const token = getState().authentication.token;
                group = await groupApi.get(token, groupId);
            }
            dispatch({
                type: actions.APP_SHOW_GENERAL_POPUP,
                showPopup: true,
                notificationTitle: notificationTitle,
                notificationId: notificationId,
                notificationAction: notificationAction,
                notificationGroup: group,
            });
        } catch (error) {
            handler.handleError(error, dispatch, 'showGroupPopup')
            logger.actionFailed('showGroupPopup')
        }
    }
}

export function showInviteGroupPopup(groupId, userId, notificationId) {
    return async function (dispatch, getState) {
        try {
            notificationApi.readNotification(notificationId);
            const groups = getState().groups.groups;
            const token = getState().authentication.token;
            if(token) {
                let group = groups[groupId];
                if (!group) {
                    group = await groupApi.get(token, groupId);
                }
                let user = await userApi.getUserById(token, userId)
                dispatch({
                    type: actions.APP_SHOW_GENERAL_POPUP,
                    showPopup: true,
                    notificationTitle: strings.inviteUserToGroup.formatUnicorn(user.name, group.name),
                    notificationId: notificationId,
                    notificationAction: strings.JoinGroup.toUpperCase(),
                    notificationGroup: group,
                });
            }
        } catch (error) {
            handler.handleError(error, dispatch, 'showGroupPopup')
            logger.actionFailed('showGroupPopup')
        }
    }
}

export function showBusinessPopup(businessId, notificationId, notificationTitle, notificationAction) {
    return async function (dispatch, getState) {
        try {
            notificationApi.readNotification(notificationId);
            let businesses = getState().businesses.businesses;
            let business = businesses[businessId];
            if (!business) {
                const token = getState().authentication.token;
                business = await businessApi.get(token, businessId);
            }
            dispatch({
                type: actions.APP_SHOW_GENERAL_POPUP,
                showPopup: true,
                notificationTitle: notificationTitle,
                notificationId: notificationId,
                notificationAction: notificationAction,
                notificationBusiness: business,
            });
        } catch (error) {
            handler.handleError(error, dispatch, 'showBusinessPopup')
            logger.actionFailed('showBusinessPopup')
        }
    }
}

export function closePopup(notificationId) {
    return async function (dispatch) {
        try {
            // notification canceled dnotificationApi.readNotification(notificationId);
            dispatch({
                type: actions.APP_SHOW_GENERAL_POPUP,
                showPopup: false,
                notificationTitle: '',
                notificationId: '',
                notificationAction: '',
                notificationGroup: '',
                notificationBusiness: ''
            });
        } catch (error) {
            handler.handleError(error, dispatch, 'closePopup')
        }
    }
}

export function doNotification(notificationId, notificationAction) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        try {
            notificationApi.doNotificationAction(token, notificationId, notificationAction);
            dispatch({
                type: actions.APP_SHOW_GENERAL_POPUP,
                showPopup: false,
                notificationTitle: '',
                notificationId: '',
                notificationAction: '',
                notificationGroup: '',
                notificationBusiness: ''
            });
        } catch (error) {
            handler.handleError(error, dispatch, 'doNotification')
        }
    }
}

export function redirectToChatGroup(groupId, notificationId, notificationAction, navigation) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        try {
            notificationApi.doNotificationAction(token, notificationId, notificationAction);
            let group = getState().groups.groups[groupId];
            if (group) {
                const groupsChats = getState().comments.groupComments[group._id];
                const user = getState().user.user;
                if (groupsChats) {
                    groupsActions.dispatchGroupChatsListener(groupsChats, group, user, token, dispatch);
                }
                groupsActions.dispatchGroupTOuch(token, groupId, dispatch)
                navigation.navigate('GroupFeed', {chat: true, group: group});
            }
        } catch (error) {
            handler.handleError(error, dispatch, 'doNotification')
        }
    }
}

