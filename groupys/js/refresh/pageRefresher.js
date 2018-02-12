import getStore from "../store";
import feedAction from '../actions/feedsMain'
import notificationAction from '../actions/notifications'
import postAction from '../actions/posts'
import promotionAction from '../actions/promotions'
import myPromotionAction from '../actions/myPromotions'
import business from '../actions/business'
import groups from '../actions/groups'
import users from '../actions/user'
import groupComments from '../actions/commentsGroup'
import pageSync from './refresher';
import FormUtils from "../utils/fromUtils";
import simpleStore from 'react-native-simple-store';
import EntityUtils from "../utils/createEntity";
let entityUtils = new EntityUtils();
import Tasks from '../tasks/tasks'

const store = getStore();
let visitedList = ['feed', 'groups', 'businesses'];
import * as actions from "../reducers/reducerActions";
class PageRefresher {
    constructor() {
        pageSync.createPage('feed', pageSync.createStdAverageRefresh('feed', 10, 360000), this.setMainFeedRefresh.bind(this));
        pageSync.createPage('groups', pageSync.createStdAverageRefresh('groups', 10, 60000), this.updateGroups.bind(this));
        pageSync.createPage('businesses', pageSync.createStdAverageRefresh('businesses', 10, 60000), this.updateBusinesses.bind(this));
        pageSync.createPage('notification', pageSync.createStdAverageRefresh('notification', 10, 60000), this.updateNotification.bind(this));
        pageSync.createPage('user', pageSync.createStdAverageRefresh('user', 10, 60000), this.updateUser.bind(this));
        pageSync.createPage('myPromotions', pageSync.createStdAverageRefresh('myPromotions', 10, 60000), this.updateMyPromotions.bind(this));

    }

    updateUser() {
        let token = store.getState().authentication.token;
        let user = store.getState().user.user;
        if (token && user) {
            users.updateUserLocale(store.dispatch, token, user, FormUtils.getLocale())
        }
    }

    updateMyPromotions() {
        let token = store.getState().authentication.token;
        if (token ) {
            myPromotionAction.fetchTopList(token, store.dispatch )
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

    updateGroups() {
        let token = store.getState().authentication.token;
        if (token) {
            groups.getAll(store.dispatch, token);
        }
    }

    updateBusinesses() {
        let token = store.getState().authentication.token;
        if (token) {

            this.checkUploadPromotionPictures(store.getState().promotions.promotionPictures,token)
            this.checkUploadPictures(store.getState().businesses.businessPictures,token)
            this.checkUploadProductsPictures(store.getState().products.productsPictures,token)
            business.getAll(store.dispatch, token);
        }
    }

    checkUploadPictures(businesses,token){
        if(businesses.length > 0){
            businesses.forEach(business => {
                entityUtils.uploadPicture('businesses',business.business, token, business.businessResponse);

            });
            store.dispatch({
                type: actions.BUSINESS_CLEAR_PIC,

            });
        }

    }

    checkUploadProductsPictures(products,token){
        if(products.length > 0){
            products.forEach(product => {
                entityUtils.uploadPicture('products', product.product, token,product.productResponse)
            });
            store.dispatch({
                type: actions.PRODUCTS_CLEAR_PIC,

            });
        }

    }

    checkUploadPromotionPictures(promotions,token){
        if(promotions.length > 0){
            promotions.forEach(promotion => {
                entityUtils.uploadPicture('promotions',promotion.promotion, token, promotion.promotionResponse);

            });
            store.dispatch({
                type: actions.PROMOTION_CLEAR_PIC,

            });
        }

    }

    setMainFeedRefresh() {
        if (store.getState().feeds.feedView && store.getState().feeds.feedView.length > 0) {
            let token = store.getState().authentication.token;
            let user = store.getState().user.user;
            let id = store.getState().feeds.feedView[0];
            if (token && user) {
                feedAction.fetchTopList(id, token, user, store.dispatch);
            }
        }
    }

    addBusinessPromotion(businessId) {
        if (!visitedList.includes('promotion_' + businessId,)) {
            pageSync.createPage('promotion_' + businessId, pageSync.createStdAverageRefresh('promotion_' + businessId, 10, 60000), this.updatePromotion.bind(this, businessId));
            visitedList.push('promotion_' + businessId);
        }
    }

    addGroupsFeed(groupsId) {
        if (!visitedList.includes('feeds' + groupsId,)) {
            pageSync.createPage('feeds' + groupsId, pageSync.createStdAverageRefresh('feeds' + groupsId, 10, 60000), this.updateGroupFeeds.bind(this, groupsId));
            visitedList.push('feeds' + groupsId);
        }
    }

    upSertGroupsChat(groupsId) {
        if (!visitedList.includes('chat' + groupsId,)) {
            pageSync.createPage('chat' + groupsId, pageSync.createStdAverageRefresh('chat' + groupsId, 5, 60000), this.updateGroupChat.bind(this, groupsId));
            visitedList.push('chat' + groupsId);
        } else {
            this.visitedGroupChat(groupsId);
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

    updateGroupFeeds(groupId) {
        let token = store.getState().authentication.token;
        if (token) {
            if (store.getState().groups.groupFeedOrder && store.getState().groups.groupFeedOrder[groupId]
                && store.getState().groups.groupFeedOrder[groupId].length > 0) {
                let user = store.getState().user.user;
                groups.fetchTopList(store.getState().groups.groupFeedOrder[groupId][0], token, {_id: groupId}, store.dispatch, user);
            }
        }
    }

    updateGroupChat(groupId) {
        let token = store.getState().authentication.token;
        if (token) {
            if (store.getState().comments.groupCommentsOrder && store.getState().comments.groupCommentsOrder[groupId]
                && store.getState().comments.groupCommentsOrder[groupId].length > 0) {
                let user = store.getState().user.user;
                groupComments.refreshComments(store.dispatch, token, {_id: groupId}, user);
            }
        }
    }

    visitedFeed() {
        Tasks.mainFeedTaskStart();
        pageSync.visited('feed')
    }

    visitedGroups() {
        pageSync.visited('groups')
    }

    visitedGroupFeeds(groupId) {
        pageSync.visited('feeds' + groupId)
    }

    visitedGroupChat(groupId) {
        pageSync.visited('chat' + groupId)
    }

    createFeedSocialState(id) {
        if (!visitedList.includes('feed' + id,)) {
            pageSync.createPage('feed' + id, pageSync.createStdAverageRefresh('feed' + id, 2, 7200000), this.updateSocialState.bind(this, id));
            visitedList.push('feed' + id);
        }
    }

    visitedFeedItem(item) {
        if (visitedList.includes('feed' + item.id,)) {
            pageSync.visited('feed' + item.id)
            this.checkRefreshFeedItem(item);
        }
    }

    createPromotionUpdate(item,businessId) {
        if (!visitedList.includes('promotion' + item._id,)) {
            pageSync.createPage('promotion' + item._id, pageSync.createStdAverageRefresh('promotion' + item._id, 2, 7200000), this.updateBusinessPromotion.bind(this, item,businessId));
            visitedList.push('promotion' + item._id);
        }
    }


    updateBusinessPromotion(item,businessId){
        let token = store.getState().authentication.token;
        if (token) {
            promotionAction.refershBusinessPromotion(item,businessId,token,store.dispatch );
        }
    }


    visitedBusinessPromotion(itemId) {
        if (visitedList.includes('promotion' + itemId,)) {
            pageSync.visited('promotion' + itemId)

        }
    }

    checkRefreshFeedItem(item) {
        if (item.uploading) {
            if (!item.banner && !item.video) {
                let token = store.getState().authentication.token;
                if (token) {
                    switch (item.itemType) {
                        case 'POST':
                            postAction.fetchPostById(item.id, token, store.dispatch)
                            break;
                        case 'PROMOTION':
                            promotionAction.fetchPromotionById(item.promotionEntity._id, token, store.dispatch)
                            break;
                    }
                }
            }
        }
    }

    updateSocialState(id) {
        console.log('refresh' + id);
        let token = store.getState().authentication.token;
        if (token) {
            feedAction.refreshFeedSocialState(store.dispatch, token, id);
        }
    }
}

let pageRefresher = new PageRefresher();
export default pageRefresher;
