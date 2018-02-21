import getStore from "../store";
import feedAction from '../actions/feedsMain'
import notificationAction from '../actions/notifications'
import postAction from '../actions/posts'
import promotionAction from '../actions/promotions'
import business from '../actions/business'
import groups from '../actions/groups'
import users from '../actions/user'
import groupComments from '../actions/commentsGroup'
import pageSync from './refresher';
import FormUtils from "../utils/fromUtils";
import simpleStore from 'react-native-simple-store';

const store = getStore();
let visitedList = ['feed', 'groups', 'businesses'];

class PageRefresher {
    constructor() {
        pageSync.createPage('groups', pageSync.createStdAverageRefresh('groups', 10, 60000), this.updateGroups.bind(this));
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

    updateGroups() {
        let token = store.getState().authentication.token;
        if (token) {
            groups.getAll(store.dispatch, token);
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
            visitedList.push('feeds' + groupsId);
        }
    }

    upSertGroupsChat(groupsId) {
        if (!visitedList.includes('chat' + groupsId,)) {
         //   pageSync.createPage('chat' + groupsId, pageSync.createStdAverageRefresh('chat' + groupsId, 5, 60000), this.updateGroupChat.bind(this, groupsId));
            visitedList.push('chat' + groupsId);
        } else {
          //  this.visitedGroupChat(groupsId);
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
        //pageSync.visited('feed')
    }

    visitedGroups() {
        pageSync.visited('groups')
    }

    visitedGroupFeeds(groupId) {
       // pageSync.visited('feeds' + groupId)
    }

    visitedGroupChat(groupId) {
      //  pageSync.visited('chat' + groupId)
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
        let token = store.getState().authentication.token;
        if (token) {
            feedAction.refreshFeedSocialState(store.getState(), store.dispatch, token, id);
        }
    }
}

let pageRefresher = new PageRefresher();
export default pageRefresher;
