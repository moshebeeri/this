/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {feeds:[],savedfeeds:[],savedShowTopLoader:false,nextLoad:false,showTopLoader:false};

export const GET_FEED = 'GET_FEEDS'
import store from 'react-native-simple-store';

export default function feeds(state = initialState, action) {
    console.log(action.type);

    switch (action.type) {

        case 'GET_FEEDS' :
            if(action.feeds && action.feeds.length > 0) {
                let feeds = filterFeed(action.feeds);
                store.save('feeds', feeds)


                return {
                    ...state,
                    feeds: action.feeds,
                    showTopLoader: action.showTopLoader,
                    loadingDone: true,
                    nextLoad: false,
                }
            }else {
                return {
                    ...state,
                    showTopLoader: action.showTopLoader,
                    loadingDone: true,
                    nextLoad: false,
                }
            }

        case 'GET_FEEDS_FROM_STORE' :
            if(action.feeds.length > 0){
                let feeds = filterFeed(action.feeds);
                return {
                    ...state,
                    feeds : feeds,
                    loadingDone: true,
                    nextLoad:false,
                    showTopLoader :false,

                };
            }
           return {
                ...state,
                feeds : action.feeds,


            };


        case 'GET_GROUP_FEEDS' :

            let feed = {...state};
            if(action.feeds && action.feeds.length > 0) {
                store.save('groups' + action.groupid, action.feeds)
                feed['groups' + action.groupid] = action.feeds;
            }
            feed['showTopLoader' +action.groupid ] = action.showTopLoader;
            feed['grouploadingDone'+ action.groupid] = true;
            return feed;
        case 'GET_GROUP_FEEDS_FROM_STORE' :

            let storeFeed = {...state};
            storeFeed['groups'+ action.groupid] = action.feeds;
            storeFeed['grouploadingDone' + action.groupid] = true;

            return storeFeed;

        case 'GROUP_FEEDS_LOAD_DONE' :
            let givenState = {...state};
            givenState['grouploadingDone' + action.groupid] = true;

            return givenState;
        case 'GET_SAVED_FEEDS' :
            store.save('savedFeeds',action.feeds)
            return {
                ...state,
                savedfeeds : action.feeds,
                savedShowTopLoader : action.showTopLoader,
                savedloadingDone: true,
            };
        case 'GET_SAVED_FEEDS_FROM_STORE':
            if(action.feeds.length > 0){
                return {
                    ...state,
                    savedfeeds : action.feeds,
                    savedloadingDone: true,

                };
            }
            return {
                ...state,
                savedfeeds : action.feeds,


            };

        case 'SHOW_TOP_LOADER' :
            return {
                ...state,
                showTopLoader : true
            };
        case 'HIDE_TOP_LOADER':
            return {
                ...state,
                showTopLoader : false
            };
        case 'SHOW_SAVED_TOP_LOADER' :
            return {
                ...state,
                savedShowTopLoader : true
            };
        case 'SHOW_GROUP_TOP_LOADER' :
            let feed2= {...state};
            feed2['showTopLoader' +action.groupid ] =true
            return feed2;
        case 'UPDATE_HOME_FEED':

            let feedState= {...state};
            let updatedFeeds = updateFeeds(feedState,action.feed);
            updatedFeeds = filterFeed(updatedFeeds);
            store.save('feeds',updatedFeeds)
            return {
                ...state,
                feeds : updatedFeeds,
            };
        case 'UPDATE_GROUP_FEED':


            let feedGroupState= {...state};
            let updatedGroupFeeds = updateGroupFeeds(feedGroupState,action.feed,action.group);
            updatedGroupFeeds = filterFeed(updatedGroupFeeds);
            feedGroupState['groups'+ action.group._id] =updatedGroupFeeds;
            store.save('groups'+ action.group._id,updatedGroupFeeds)
            return feedGroupState;
        case 'FEED_LOADING':
            return {
                ...state,
                nextLoad : true
            };
        case 'FEED_LOADING_DONE':
            return {
                ...state,
                loadingDone : true
            };
        case 'SAVED_FEED_LOADING_DONE':
            return {
                ...state,
                savedloadingDone : true
            };
        default:
            return state;
    }
};


function updateFeeds(feedState,feed) {

   return feedState.feeds.map(function (item) {
       if(item.id == feed.id){
           return feed;
       }
       return item;
    })

}

function updateGroupFeeds(feedState,feed,group) {
    let feeds =  feedState['groups'+ group._id]
    return feeds.map(function (item) {
        if(item.id == feed.id){
            return feed;
        }
        return item;
    })

}

function filterFeed(feeds){
    let feedIds = new Set();

    feeds = feeds.filter(function (feed) {
        if(!feed.id){
            return false;
        }
        if(feedIds.has(feed.id)){
            return false;
        }

        feedIds.add(feed.id)
        return true;

    })

    return feeds;
}