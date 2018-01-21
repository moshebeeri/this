import * as actions from "../reducers/reducerActions";
import InstanceApi from "../api/instances";
import CollectionDispatcher from "./collectionDispatcher";
import * as assemblers from "./collectionAssembler";
import NotificationApi from "../api/notification";
import GoupApi from "../api/groups";
import BusinessApi from "../api/business";
import ActionLogger from './ActionLogger'

let notificationApi = new NotificationApi();
let instanceApi = new InstanceApi();
let groupApi = new GoupApi();
let businessApi= new BusinessApi();
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
            logger.actionFailed('showPromotionPopup')
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
            logger.actionFailed('showGenericPopup')
        }
    }
}


export function showGroupPopup( groupId,notificationId,notificationTitle, notificationAction) {
    return async function (dispatch,getState) {
        try {
            notificationApi.readNotification(notificationId);
            let groups = getState().groups.groups;
            let group  = groups[groupId];
            if(!group){
                const token = getState().authentication.token;
                group = await groupApi.get(token,groupId);
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
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            logger.actionFailed('showGroupPopup')
        }
    }
}

export function showBusinessPopup( businessId,notificationId,notificationTitle, notificationAction) {
    return async function (dispatch,getState) {
        try {
            notificationApi.readNotification(notificationId);
            let businesses = getState().businesses.businesses;
            let business  = businesses[businessId];
            if(!business){
                const token = getState().authentication.token;
                business = await businessApi.get(token,businessId);
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
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            logger.actionFailed('showBusinessPopup')
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
                notificationAction: '',
                notificationGroup:'',
                notificationBusiness:''
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
                notificationAction: '',
                notificationGroup:'',
                notificationBusiness:''
            });
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

