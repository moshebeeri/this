import getStore from "../store";
import notificationAction from '../actions/notifications'
import promotionAction from '../actions/promotions'
import business from '../actions/business'
import groups from '../actions/groups'
import users from '../actions/user'
import pageSync from './refresher';
import FormUtils from "../utils/fromUtils";
import simpleStore from 'react-native-simple-store';

const store = getStore();
let visitedList = ['feed', 'groups', 'businesses'];

class PageRefresher {
    constructor() {
        pageSync.createPage('notification', pageSync.createStdAverageRefresh('notification', 10, 60000), this.updateNotification.bind(this));
        pageSync.createPage('user', pageSync.createStdAverageRefresh('user', 10, 60000), this.updateUser.bind(this));
    }

    updateUser() {
        let token = store.getState().authentication.token;
        let user = store.getState().user.user;
        if (token && user) {
            users.updateUserLocale(store.dispatch, token, user, FormUtils.getLocale())
        }
    }

    async updateUserFireBase(fireBaseToken) {
        let token = store.getState().authentication.token;
        if (!token) {
            token = await simpleStore.get("token");
        }
        let user = store.getState().user.user;
        if (!user) {
            user = await simpleStore.get("user");
        }
        if (token && user) {
            users.updateUserToken(store.dispatch, token, user, fireBaseToken)
        }
    }

    updateNotification() {
        let token = store.getState().authentication.token;
        let user = store.getState().user.user;
        let notifications = store.getState().notification.notification;
        if (token && user) {
            notificationAction.updateNotification(store.dispatch, token, user, notifications);
        }
    }

    addBusinessPromotion(businessId) {
        if (!visitedList.includes('promotion_' + businessId,)) {
            pageSync.createPage('promotion_' + businessId, pageSync.createStdAverageRefresh('promotion_' + businessId, 10, 60000), this.updatePromotion.bind(this, businessId));
            visitedList.push('promotion_' + businessId);
        }
    }

    visitedPromotions(businessId) {
        if (visitedList.includes('promotion_' + businessId,)) {
            pageSync.visited('promotion_' + businessId)
        }
    }

    updatePromotion(businessId) {
        let token = store.getState().authentication.token;
        if (token) {
            business.updateBusinessPromotions(businessId, token, store.dispatch);
        }
    }

    createFeedSocialState(id) {
        if (!visitedList.includes('feed' + id,)) {
            pageSync.createPage('feed' + id, pageSync.createStdAverageRefresh('feed' + id, 2, 7200000), this.updateSocialState.bind(this, id));
            visitedList.push('feed' + id);
        }
    }

    createPromotionUpdate(item, businessId) {
        if (!visitedList.includes('promotion' + item._id,)) {
            pageSync.createPage('promotion' + item._id, pageSync.createStdAverageRefresh('promotion' + item._id, 2, 7200000), this.updateBusinessPromotion.bind(this, item, businessId));
            visitedList.push('promotion' + item._id);
        }
    }

    updateBusinessPromotion(item, businessId) {
        let token = store.getState().authentication.token;
        if (token) {
            promotionAction.refershBusinessPromotion(item, businessId, token, store.dispatch);
        }
    }

    visitedBusinessPromotion(itemId) {
        if (visitedList.includes('promotion' + itemId,)) {
            pageSync.visited('promotion' + itemId)
        }
    }

    updateSocialState(id) {
        let token = store.getState().authentication.token;
    }
}

let pageRefresher = new PageRefresher();
export default pageRefresher;
