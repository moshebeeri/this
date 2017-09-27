/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {feeds:{},feedView:[],savedfeeds:[],savedShowTopLoader:false,nextLoad:false,showTopLoader:false,update:false,lastfeed:undefined};

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
    let currentFeeds = feedstate.feeds;

    switch (action.type) {


        case actions.LAST_FEED_DOWN:
             feedstate.lastfeed = action.id

            return feedstate;

        case actions.UPSERT_FEEDS:

            currentFeeds[action.item._id] = action.item;
            if (!feedstate.feedView.includes(action.item._id)) {
                feedstate.feedView.push(action.item._id);
            }

            feedstate.feeds = currentFeeds;
            return feedstate;
        case actions.UPSERT_FEEDS_TOP:

            currentFeeds[action.item._id] = action.item;
            if (!feedstate.feedView.includes(action.item._id)) {
                feedstate.feedView.unshift(action.item._id);
            }
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