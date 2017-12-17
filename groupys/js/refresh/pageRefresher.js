import getStore from "../store";
import feedAction from '../actions/feedsMain'
import business from '../actions/business'
import groups from '../actions/groups'
import groupComments from '../actions/commentsGroup'
import pageSync from './refresher';

const store = getStore();
let  visitedList = ['feed', 'groups', 'businesses'];
class PageRefresher {

    constructor() {
        pageSync.createPage('feed', pageSync.createStdAverageRefresh('feed', 10, 60000), this.setMainFeedRefresh.bind(this));
        pageSync.createPage('groups', pageSync.createStdAverageRefresh('groups', 10, 60000), this.updateGroups.bind(this));
        pageSync.createPage('businesses', pageSync.createStdAverageRefresh('businesses', 10, 360000), this.updateBusinesses.bind(this));


    }

    updateGroups() {
        let token = store.getState().authentication.token;
        groups.getAll(store.dispatch, token);
    }

    updateBusinesses() {
        let token = store.getState().authentication.token;
        business.getAll(store.dispatch, token);
    }

    setMainFeedRefresh() {
        if (store.getState().feeds.feedView && store.getState().feeds.feedView.length > 0) {
            let token = store.getState().authentication.token;
            let user = store.getState().user.user;
            let id = store.getState().feeds.feedView[0]
            feedAction.fetchTopList(id, token, user, store.dispatch);
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
        }else{
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
        business.updateBusinessPromotions(businessId, token, store.dispatch);
    }


    updateGroupFeeds(groupId) {
        let token = store.getState().authentication.token;

        if (store.getState().groups.groupFeedOrder && store.getState().groups.groupFeedOrder[groupId]
            && store.getState().groups.groupFeedOrder[groupId].length > 0) {
            groups.fetchTopList(store.getState().groups.groupFeedOrder[groupId][0], token, {_id: groupId}, store.dispatch);
        }
    }
    updateGroupChat(groupId) {
        let token = store.getState().authentication.token;

        if (store.getState().comments.groupCommentsOrder && store.getState().comments.groupCommentsOrder[groupId]
            && store.getState().comments.groupCommentsOrder[groupId].length > 0) {
            groupComments.refreshComments(store.dispatch, token, {_id: groupId});
        }
    }

    visitedFeed() {
        pageSync.visited('feed')
    }

    visitedGroups() {
        pageSync.visited('groups')
    }

    visitedGroupFeeds(groupId) {
        pageSync.visited('feeds' +groupId)
    }
    visitedGroupChat(groupId) {
        pageSync.visited('chat' +groupId)
    }

    createFeedSocialState(id){
        if (!visitedList.includes('feed' + id,)) {
            pageSync.createPage('feed' + id, pageSync.createStdAverageRefresh('feed' + id, 2, 7200000), this.updateSocialState.bind(this, id));
            visitedList.push('feed' + id);
        }
    }

    visitedFeedItem(id) {
        if (visitedList.includes('feed' + id,)) {
            console.log('visited updated' + id);
            pageSync.visited('feed' + id)
        }
    }


    updateSocialState(id){
        console.log('refresh' + id);
        let token = store.getState().authentication.token;
        feedAction.refreshFeedSocialState(store.dispatch,token,id);
    }
}

let pageRefresher = new PageRefresher();
export default pageRefresher;
