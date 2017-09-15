/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {feeds:{},feedOrder:[],showTopLoader:false,update:false,lastfeed:undefined};


import { REHYDRATE } from 'redux-persist/constants'

import * as actions from './reducerActions';
export default function myPromotions(state = initialState, action) {
    console.log(action.type);
    if (action.type === REHYDRATE){

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;

        return {
            ...state,
            ...savedData.myPromotions,
            loadingDone:true,
            showTopLoader:false
        };
    }
    let feedstate = {...state};
    switch (action.type) {


        case actions.SAVED_LAST_FEED_DOWN:
            feedstate.lastfeed = action.id

            return feedstate;

        case actions.UPSERT_SAVED_FEEDS:

            let currentFeeds = feedstate.feeds;

            currentFeeds[action.item.instance._id] = action.item;
            if (feedstate.feedOrder.includes(action.item.instance._id)) {
                return state
            }

            feedstate.feedOrder.push(action.item.instance._id);
            return feedstate;
        case actions.SAVED_FEED_LOADING_DONE:
            return {
                ...state,
                loadingDone : action.loadingDone
            };
        case actions.SAVED_FEED_SHOW_TOP_LOADER:
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