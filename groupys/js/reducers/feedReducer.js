/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {feeds:{},savedfeeds:[],savedShowTopLoader:false,nextLoad:false,showTopLoader:false};

export const GET_FEED = 'GET_FEEDS'
import store from 'react-native-simple-store';
import { REHYDRATE } from 'redux-persist/constants'

import * as actions from './reducerActions';
export default function feeds(state = initialState, action) {
    console.log(action.type);
    if (action.type === REHYDRATE){

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;

        return {
            ...state,
            ...savedData.feeds,
            loadingDone:true,
            showTopLoader:false
        };
    }
    let feedstate = {...state};
    switch (action.type) {



        case actions.UPSERT_FEEDS:
            let currentFeeds = feedstate.feeds;

            currentFeeds[action.item._id] = action.item;
            feedstate.feeds = currentFeeds;
            return feedstate;
        case actions.FEED_LOADING_DONE:
            return {
                ...state,
                loadingDone : action.loadingDone
            };
        case actions.FEED_SHOW_TOP_LOADER:
            return {
                ...state,
                showTopLoader : action.showTopLoader
            };
        case 'SAVED_FEED_LOADING_DONE':
            return {
                ...state,
                savedloadingDone : true
            };

        case 'GET_GROUP_FEEDS' :

            let feed = {...state};
            if(action.feeds && action.feeds.length > 0) {
                feed['groups' + action.groupid] = action.feeds;
            }
            feed['showTopLoader' +action.groupid ] = action.showTopLoader;
            feed['grouploadingDone'+ action.groupid] = true;
            return feed;


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
            return {
                ...state,
                feeds : updatedFeeds,
            };
        case 'UPDATE_GROUP_FEED':


            let feedGroupState= {...state};
            let updatedGroupFeeds = updateGroupFeeds(feedGroupState,action.feed,action.group);
            updatedGroupFeeds = filterFeed(updatedGroupFeeds);
            feedGroupState['groups'+ action.group._id] =updatedGroupFeeds;
            return feedGroupState;
        case 'DIRECT_ADD_GROUP_FEED':
            let feedDirectGroupState= {...state};
            let updatedDirectGroupFeeds = addGroupFeeds(feedDirectGroupState,action.feed,action.group);
            updatedDirectGroupFeeds = filterFeed(updatedDirectGroupFeeds);
            feedDirectGroupState['groups'+ action.group._id] =updatedDirectGroupFeeds;
            return feedDirectGroupState;

        case 'FEED_LOADING':
            return {
                ...state,
                nextLoad : true
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

function addGroupFeeds(feedState,feed,group) {
    let feeds =  feedState['groups'+ group._id]
    if(feeds && feeds.length>0){
        feeds.unshift(feed);

    }else {
        feeds = new Array();
        feeds.unshift(feed);

    }
    return feeds;

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