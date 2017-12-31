/**
 * Created by roilandshut on 07/09/2017.
 */
import {createSelector} from 'reselect'
import * as assemblers from "../actions/collectionAssembler";
import FeedUiConverter from "../api/feed-ui-converter";
import getStore from "../store";
let feedUiConverter = new FeedUiConverter();
import store from 'react-native-simple-store';

const reduxStore = getStore();
const getAuthentication = (state) => state.authentication
const getMainTab = (state) => state.mainTab
const getInstances= (state) => state.instances
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
    [getMainTab,], function (mainTab ,instances) {
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
    [getMainTab,getInstances], function (mainTab,instances) {
        let instanceId = mainTab.instanceId;
        if(!instanceId){
            return undefined;
        }

        if(!instances.instances){
            return undefined;
        }
        const collections = {
            activities: reduxStore.getState().activities.activities,
            promotions: reduxStore.getState().promotions.promotions,
            user: reduxStore.getState().user.users,
            posts:reduxStore.getState().postForm.posts,
            businesses: reduxStore.getState().businesses.businesses,
            instances: instances.instances,
            products: reduxStore.getState().products.products
        };
        let feed = {

            instance:instanceId,
        };
        let assemblerFeed = assemblers.assembler(feed, collections)

        let instance = assemblerFeed.instance;
        instance.activity = {
            action:'instance',
        }
        let uiItem = feedUiConverter.createFeed(instance)
        return uiItem;
    }
)
export const countUnreadNotifications = createSelector(
    [getNotifications], function (notification) {
        let result = 0;
        if(notification.notification) {
            notification.notification.forEach(notification => {
                if (!notification.read) {
                    if(notification.note === 'ADD_BUSINESS_FOLLOW_ON_ACTION' && !notification.business ){
                       //Todo
                    }else {
                        result = result + 1;
                    }
                }
            });
        }
        return result;
    }
)