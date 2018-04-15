/**
 * Created by roilandshut on 07/09/2017.
 */
import {createSelector} from 'reselect'
import FeedUiConverter from "../api/feed-ui-converter";
import store from 'react-native-simple-store';
import * as notificationTypes from "../components/notifications/list-view/notofications";
import InstanceLifeCycle from '../utils/InstanceLifeCycle'

let feedUiConverter = new FeedUiConverter();
const getAuthentication = (state) => state.authentication
const getMainTab = (state) => state.mainTab
const getStateSavedInstances = (state) => state.myPromotions;
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
    [getMainTab, getStateSavedInstances], function (mainTab, savedPromotion) {
        let instanceLifeCycle = new InstanceLifeCycle(savedPromotion.feeds);
        if (mainTab.instance) {
            let item = feedUiConverter.createPromotionInstance(mainTab.instance, instanceLifeCycle);
            return item;
        }
        return undefined;
    }
)
export const countUnreadNotifications = createSelector(
    [getNotifications], function (notification) {
        let result = 0;
        if (notification.notification) {
            let results = notification.notification.filter(notification => {
                if (notification.note === notificationTypes.ADD_BUSINESS_FOLLOW_ON_ACTION) {
                    return true;
                }
                if (notification.note === notificationTypes.ADD_FOLLOW_PROMOTION) {
                    return true;
                }
                if (notification.note === notificationTypes.ASK_GROUP_INVITATION) {
                    return true;
                }
                if (notification.note === notificationTypes.APPROVE_GROUP_INVITATION) {
                    return true;
                }
                return false;
            })
            if (results.length > 0) {
                results.forEach(notification => {
                    if (!notification.read) {
                        if (notification.note === 'ADD_BUSINESS_FOLLOW_ON_ACTION' && !notification.business) {
                            //Todo
                        } else {
                            result = result + 1;
                        }
                    }
                });
            }
        }
        return result;
    }
)