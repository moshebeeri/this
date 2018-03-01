/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {
    selectedTab: 0,
    showAdd: false,
    showPopup: false,
    instance: undefined,
    notificationTitle: '',
    notificationId: '',
    notificationAction: '',
    notificationGroup: undefined,
    notificationBusiness: undefined
};
import * as actions from './../reducerActions';

export default function mainTab(state = initialState, action) {
    switch (action.type) {
        case actions.APP_CHANGE_TAB :
            return {
                ...state,
                selectedTab: action.selectedTab,
            };
        case actions.APP_SHOW_ADD_FAB :
            return {
                ...state,
                showAdd: action.showAdd,
            };
        case actions.APP_SHOW_PROMOTION_POPUP :
            return {
                ...state,
                showPopup: action.showPopup,
                instance: action.instance,
                notificationId: action.notificationId,
            };
        case actions.APP_SHOW_GENERAL_POPUP :
            return {
                ...state,
                showPopup: action.showPopup,
                notificationTitle: action.notificationTitle,
                notificationId: action.notificationId,
                notificationAction: action.notificationAction,
                notificationGroup: action.notificationGroup,
                notificationBusiness: action.notificationBusiness,
                instance: undefined,
            };
        default:
            return state;
    }
};