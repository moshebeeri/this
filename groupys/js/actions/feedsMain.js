/**
 * Created by roilandshut on 08/06/2017.
 */


import FeedApi from "../api/feed"
let feedApi = new FeedApi();

import UserApi from "../api/user"
let userApi = new UserApi();
import PtomotionApi from "../api/promotion"
let promotionApi = new PtomotionApi();
import ActivityApi from "../api/activity"
let activityApi = new ActivityApi();
import * as actions from '../reducers/reducerActions';
import * as assemblers from './collectionAssembler';
async function fetchFeedsFromServer(feeds,dispatch,token,user){
    try {

        let response = null;
        if( _.isEmpty(feeds)){
            response =  await feedApi.getAll('down','start',token,user);
        }else{
            let keys = Object.keys(feeds)
            let id = keys[keys.length-1]
            response =  await feedApi.getAll('down',feeds[id].fid,token,user);
        }

        if(!response)
            return;

        if(response.length == 0){
            return;
        }

        let disassemblerItems = response.map(item => assemblers.disassembler(item,dispatch))

        disassemblerItems.forEach(item => dispatch({
            type: actions.UPSERT_FEEDS,
            item:item
        }))



        ;


    }catch (error){
        console.log('error')
    }



}



async function fetchTopList(id,token,user,dispatch){
    try {

        let response  =  await feedApi.getAll('up',id,token,user);
        if(!response)
            return;

        if(response.length == 0){
            return;
        }
        let disassemblerItems = response.map(item => assemblers.disassembler(item,dispatch))

        disassemblerItems.forEach(item => dispatch({
            type: actions.UPSERT_FEEDS,
            item:item
        }))



    }catch (error){
        console.log(error);
    }

}






export function fetchTop(feeds,token,user){

    return async function (dispatch, getState){
        if(getState().feeds.showTopLoader){
            return;
        }
        await dispatch({
            type: actions.FEED_SHOW_TOP_LOADER,
            showTopLoader: true,

        });
        await fetchTopList(feeds[0].id,token,user,dispatch);
        await dispatch({
            type: actions.FEED_SHOW_TOP_LOADER,
            showTopLoader: false,

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



async function getAll(dispatch){
    try {
        let response = await groupsApi.getAll();
        if(response.length > 0) {

            dispatch({
                type: 'GET_GROUPS',
                groups: response,

            });
        }


    }catch (error){
        console.log(error);
    }

}

export function setNextFeeds(feeds,token,user){
    return async function (dispatch){
        let showLoadingDone = false;
        if( _.isEmpty(feeds)) {
            dispatch({
                type: actions.FEED_LOADING_DONE,
                loadingDone: false,


            });
            showLoadingDone = true;
        }
        await fetchFeedsFromServer(feeds,dispatch,token,user)
        if(showLoadingDone) {
            dispatch({
                type: actions.FEED_LOADING_DONE,
                loadingDone: true,

            });
        }
    }
}

export function like(id){
    return async function (dispatch, getState){
        const token = getState().authentication.token
        dispatch({
            type: actions.LIKE,
            id:id
        });
        await userApi.like(id,token);
    }
}

export const unlike = (id) => {
    return async function (dispatch, getState) {
        const token = getState().authentication.token
        await userApi.unlike(id,token);
        dispatch({
            type: actions.UNLIKE,
            id:id
        });
    }
};


export function saveFeed(id) {
    return async function (dispatch, getState) {
        dispatch({
            type: actions.SAVE,
            id:id
        });
        await promotionApi.save(id);
    }
}

export function setUserFollows() {
    return async function (dispatch, getState) {

        try {
           const token = getState().authentication.token
            let response = await userApi.getUserFollowers(token);
            dispatch({
                type: actions.USER_FOLLOW,
                followers: response
            });
        }catch (error){
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}
export function shareActivity(id,activityId,users,token) {
    return async function (dispatch, getState) {

        users.forEach(function (user) {
             activityApi.shareActivity(user,activityId,token)
        })
        dispatch({
            type: actions.SHARE,
            id:id,
            shares:users.length
        });
    }
}



export function nextLoad(){
    return function (dispatch, getState) {
        dispatch({
            type: 'FEED_LOADING',
        });
    }

}






