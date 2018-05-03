const initialState = {currentScreen: 'home', currentTab: 'feed',isMain: true};
import * as actions from "./reducerActions";
import {I18nManager, Platform} from 'react-native';

export default function render(state = initialState, action) {
    switch (action.type) {
        case actions.CURRENT_SCREEN:
            return {
                ...state,
                currentScreen: action.screen,
            };
        case actions.CURRENT_MAIN:
            return {
                ...state,
                isMain: action.isMain,
            };
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
                currentTab: tab,
            };
        default:
            return state;
    }
};
