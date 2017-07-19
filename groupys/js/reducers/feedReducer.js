/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {feeds:[],savedfeeds:[],savedShowTopLoader:false};

export const GET_FEED = 'GET_FEEDS'


export default function feeds(state = initialState, action) {
    console.log(action.type);
    switch (action.type) {

        case 'GET_FEEDS' :
            return {
                ...state,
                feeds : action.feeds,
                showTopLoader : action.showTopLoader,
                loadingDone: true,
            };

        case 'GET_GROUP_FEEDS' :

            let feed = {...state};
            feed['groups'+ action.groupid] = action.feeds;
            feed['showTopLoader' +action.groupid ] = action.showTopLoader;
            feed['grouploadingDone'+ action.groupid] = true;
            return feed;
        case 'GET_SAVED_FEEDS' :
            return {
                ...state,
                savedfeeds : action.feeds,
                savedShowTopLoader : action.showTopLoader,
                savedloadingDone: true,
            };
        case 'SHOW_TOP_LOADER' :
            return {
                ...state,
                showTopLoader : true
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
            return {
                ...state,
                feeds : updatedFeeds,
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