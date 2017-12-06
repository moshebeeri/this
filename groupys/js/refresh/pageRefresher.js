import getStore from "../store";
import feedAction from '../actions/feedsMain'
import pageSync from './refresher';
const store = getStore();

class PageRefresher{


    constructor() {

        let feedSyncTimePolicy = pageSync.createStdAverageRefresh('feed',10,5000);
        pageSync.createPage('feed', feedSyncTimePolicy,() => {
            console.log('refreshing feed !!!!');
        });
        // pageSync.createPage('feed2',pageSync.createStdAverageRefresh('feed2',10,5000), () => {
        //     console.log('feed2 refreshing feed !!!!');
        // });
        // pageSync.createPage('feed3',pageSync.createStdAverageRefresh('feed3',10,5000),() => {
        //     console.log('feed3 refreshing feed !!!!');
        // });
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
