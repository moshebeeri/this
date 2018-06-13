/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
import {I18nManager, Platform} from 'react-native';
import {REHYDRATE} from "redux-persist/constants";
import * as actions from './../reducerActions';

const initialState = {
    selectedTab: 'feed',
    showAdd: false,
    showPopup: false,
    instance: undefined,
    stateReady: false,
    notificationTitle: '',
    notificationId: '',
    notificationAction: '',
    notificationGroup: undefined,
    notificationBusiness: undefined
};
export default function mainTab(state = initialState, action) {
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.mainTab, stateReady: true
        };
    }
    switch (action.type) {
        case  actions.CURRENT_TAB:
            let tab = 'feed'
            if (action.currentTab.i === 0) {
                if (I18nManager.isRTL && (Platform.OS === 'android')) {
                    tab = 'notification';
                } else {
                    tab = 'feed';
                }
            }
            if (action.currentTab.i === 1) {
                if (I18nManager.isRTL && (Platform.OS === 'android')) {
                    tab = 'groups';
                } else {
                    tab = 'savedPromotion';
                }
            }
            if (action.currentTab.i === 2) {
                if (I18nManager.isRTL && (Platform.OS === 'android')) {
                    tab = 'savedPromotion';
                } else {
                    tab = 'groups';
                }
            }
            if (action.currentTab.i === 3) {
                if (I18nManager.isRTL && (Platform.OS === 'android')) {
                    tab = 'feed';
                } else {
                    tab = 'notification';
                }
            }
            return {
                ...state,
                selectedTab: tab,
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