/**
 * Created by roilandshut on 07/09/2017.
 */
import {createSelector} from 'reselect'
import store from 'react-native-simple-store';

const getAuthentication = (state) => state.authentication
const getMainTab = (state) => state.mainTab
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