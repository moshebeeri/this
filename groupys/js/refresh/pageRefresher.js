import getStore from "../store";
import feedAction from '../actions/feedsMain'
import business from '../actions/business'
import groups from '../actions/groups'
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

    visitedFeed() {
        pageSync.visited('feed')
    }

    visitedGroups() {
        pageSync.visited('groups')
    }
}

let pageRefresher = new PageRefresher();
export default pageRefresher;
