import getStore from "../store";
import feedAction from '../actions/feedsMain'
import pageSync from './refresher';
const store = getStore();

class PageRefresher{


    constructor() {

        pageSync.createPage('feed',  pageSync.createStdAverageRefresh('feed',10,60000),this.setMainFeedRefresh.bind(this));

    }


    setMainFeedRefresh(){
        try {
            if (store.getState().feeds.feedView && store.getState().feeds.feedView.length > 0) {
                let token = store.getState().authentication.token;
                let user = store.getState().user.user;
                let id = store.getState().feeds.feedView[0]
                feedAction.fetchTopList(id, token, user, store.dispatch);
            }
        }catch (error){
            console.log('failed');
        }
    }

    visitedFeed(){
        pageSync.visited('feed')
    }



}

let pageRefresher = new PageRefresher();

export default pageRefresher;
