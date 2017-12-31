import * as actions from "../reducers/reducerActions";
import InstanceApi from "../api/instances";
import CollectionDispatcher from "./collectionDispatcher";
import * as assemblers from "./collectionAssembler";

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

export function showPromotionPopup(show, instanceId) {
    return async function (dispatch, getState) {
        try {
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
                showPopup: show,
                instanceId: instanceId,
            });
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

export function showGenericPopup(show, genericMessage,code) {
    return async function (dispatch) {
        dispatch({
            type: actions.APP_SHOW_GENERAL_POPUP,
            showPopup: show,
            generalNotification: genericMessage,
            generalCode:code
        });
    }
}



