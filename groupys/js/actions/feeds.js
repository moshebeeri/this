/**
 * Created by roilandshut on 08/06/2017.
 */



import UserApi from "../api/user"
let userApi = new UserApi();
import store from 'react-native-simple-store';

async function fetchList(action,feeds,api,dispatch,groupid){
    try {

        let response = null;
        if(feeds.length == 0 ){
            response =  await api.getAll('down','start');
        }else{
            response =  await api.getAll('down',feeds[feeds.length-1].id);
        }
        if(response.length > 0 && feeds.length > 0) {
            feeds =  addToRows(feeds,response, false);

        }else{
            feeds = response;
        }

        if( feeds.length > 0) {
            console.log(feeds);
            if(groupid){
                dispatch({
                    type: action,
                    feeds: feeds,
                    showTopLoader: false,
                    groupid:groupid
                });
            }else {
                dispatch({
                    type: action,
                    feeds: feeds,
                    showTopLoader: false
                });
            }
        }else{
            if(action = 'GET_FEEDS') {
                dispatch({
                    type: 'FEED_LOADING_DONE',
                });
            }else{
                dispatch({
                    type: 'SAVED_FEED_LOADING_DONE',
                });
            }
        }

    }catch (error){
       console.log('error')
    }



}

async function getFeedsFromStore(dispatch){
    try {
        let response = await store.get('feeds');
        if(response.length > 0) {

            dispatch({
                type: 'GET_FEEDS_FROM_STORE',
                feeds: response,

            });
        }


    }catch (error){
        console.log(error);
    }
}



function addToRows(feeds,response,top){
    let currentRows = feeds;
    let newFeeds = response.filter(function (feed) {
        let filtered = currentRows.filter(function (currentFeed) {
            if(currentFeed.id == feed.id){
                return true;
            }
            return false;

        })
        return filtered.length == 0;
    })
    if(newFeeds.length > 0) {
        if (top) {
            currentRows = newFeeds.concat(feeds);
        } else {
            currentRows = feeds.concat(newFeeds)
        }
    }
    return currentRows;

}

async function fetchTopList(action,feeds,id,api,dispatch,groupid){
    try {
        if(feeds.length > 0 ) {
            if (id == feeds[0].id) {

                let response = await api.getAll('up', feeds[0].id);
                if(response.length > 0) {
                    feeds = addToRows(feeds,response, true);
                    dispatch({
                        type: action,
                        feeds: feeds,
                        showTopLoader: false,
                        groupid:groupid
                    });
                }
            }

        }

    }catch (error){
        console.log(error);
    }

}

export function fetchFeedsFromStore(){
    return function (dispatch, getState){
        dispatch|(getFeedsFromStore(dispatch));
    }

}


export function fetchFeeds(action,feeds,api){
    return function (dispatch, getState){
        dispatch|(fetchList(action,feeds,api,dispatch,null));
    }

}
export function fetchTop(action,feeds,id,api){
    return function (dispatch, getState){
        dispatch|(fetchTopList(action,feeds,id,api,dispatch,null));
    }

}

export function fetchGroupFeeds(groupid,action,feeds,api){
    return function (dispatch, getState){
        dispatch|(fetchList(action,feeds,api,dispatch,groupid));
    }

}
export function fetchGroupTop(groupid,action,feeds,id,api){
    return function (dispatch, getState){
        dispatch|(fetchTopList(action,feeds,id,api,dispatch,groupid));
    }

}

export function showTopLoader(){
    return function (dispatch, getState){
        dispatch({
            type:'SHOW_TOP_LOADER'
        });
    }

}

export function showSavedTopLoader(){
    return function (dispatch, getState){
        dispatch({
            type:'SHOW_SAVED_TOP_LOADER'
        });
    }

}

export function showGroupTopLoader(groupid) {
    return function (dispatch, getState) {
        dispatch({
            type: 'SHOW_GROUP_TOP_LOADER',
            groupid: groupid
        });
    }
}

async function getUserFollowers(dispatch){
    try {
        let users = await userApi.getUserFollowers();

        dispatch({
            type: 'GET_USER_FOLLOWERS',
            followers: users

        });



    }catch (error){
        console.log(error);
    }

}

async function getUser(dispatch){
    try {
        let user = await userApi.getUser();

        dispatch({
            type: 'GET_USER',
            user: user

        });



    }catch (error){
        console.log(error);
    }

}



export function updateHomeFeed(feed) {
    return function (dispatch, getState) {
        dispatch({
            type: 'UPDATE_HOME_FEED',
            feed: feed
        });
    }
}
export function fetchUsers(){
    return function (dispatch, getState){
        dispatch|(getUser(dispatch,));
    }

}
export function fetchUsersFollowers(){
    return function (dispatch, getState){
        dispatch|(getUserFollowers(dispatch,));
    }

}
export function nextLoad(){
    return function (dispatch, getState) {
        dispatch({
            type: 'FEED_LOADING',
        });
    }

}




