/**
 * Created by roilandshut on 07/09/2017.
 */
import {createSelector} from 'reselect'
import FeedUiConverter from "../api/feed-ui-converter";
import getStore from "../store";
import store from 'react-native-simple-store';

let feedUiConverter = new FeedUiConverter();
const reduxStore = getStore();
const getAuthentication = (state) => state.authentication
const getMainTab = (state) => state.mainTab
const getInstances = (state) => state.instances
const getNotifications = (state) => state.notification
export const isAuthenticated = createSelector(
    [getAuthentication], async function (authentication) {
        let token = await store.get("token");
        if (token) {
            return true;
        }
        return false;
    }
)
export const showCompoenent = createSelector(
    [getAuthentication], function (authentication) {
        const token = authentication.token
        if (token) {
            return true;
        }
        return false;
    }
)
export const showAddAction = createSelector(
    [getMainTab], function (mainTab) {
        let index = mainTab.selectedTab;
        switch (index) {
            case 2:
                return true;
            default:
                return false;
        }
    }
)
export const addComponent = createSelector(
    [getMainTab,], function (mainTab, instances) {
        let index = mainTab.selectedTab;
        switch (index) {
            case 2:
                return 'AddGroups';
            default:
                return undefined;
        }
    }
)
export const getPopUpInstance = createSelector(
    [getMainTab], function (mainTab) {
        if (mainTab.instance) {
            return feedUiConverter.createPromotionInstance(mainTab.instance);
        }
        return undefined;
    }
)
export const countUnreadNotifications = createSelector(
    [getNotifications], function (notification) {
        let result = 0;
        if (notification.notification) {
            notification.notification.forEach(notification => {
                if (!notification.read) {
                    if (notification.note === 'ADD_BUSINESS_FOLLOW_ON_ACTION' && !notification.business) {
                        //Todo
                    } else {
                        result = result + 1;
                    }
                }
            });
        }
        return result;
    }
)