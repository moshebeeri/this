/**
 * Created by roilandshut on 07/09/2017.
 */
import {createSelector} from 'reselect'
import store from 'react-native-simple-store';

const getAuthentication = (state) => state.authentication
const getMainTab = (state) => state.mainTab
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
    [getMainTab], function (mainTab) {
        let index = mainTab.selectedTab;
        switch (index) {
            case 2:
                return 'AddGroups';
            default:
                return undefined;
        }
    }
)
export const countUnreadNotifications = createSelector(
    [getNotifications], function (notification) {
        let result = 0;
        if(notification.notification) {
            notification.notification.forEach(notification => {
                if (!notification.read) {
                    result = result + 1;
                }
            });
        }
        return result;
    }
)