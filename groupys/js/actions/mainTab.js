import * as actions from "../reducers/reducerActions";
import InstanceApi from "../api/instances";
import CollectionDispatcher from "./collectionDispatcher";
import * as assemblers from "./collectionAssembler";
import NotificationApi from "../api/notification";

let notificationApi = new NotificationApi();
let instanceApi = new InstanceApi();

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

export function showPromotionPopup( instanceId,notificationId) {
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
                notificationId:notificationId
            });
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

export function showGenericPopup( notificationTitle, notificationId, notificationAction) {
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
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}


export function closePopup(  notificationId) {
    return async function (dispatch) {
        try {
            // notification canceled dnotificationApi.readNotification(notificationId);
            dispatch({
                type: actions.APP_SHOW_GENERAL_POPUP,
                showPopup: false,
                notificationTitle: '',
                notificationId: '',
                notificationAction: ''
            });
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}
export function doNotification(  notificationId, notificationAction) {
    return async function (dispatch,getState) {
        const token = getState().authentication.token;
        try {
            notificationApi.doNotificationAction(token,notificationId,notificationAction);
            dispatch({
                type: actions.APP_SHOW_GENERAL_POPUP,
                showPopup: false,
                notificationTitle: '',
                notificationId: '',
                notificationAction: ''
            });
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

