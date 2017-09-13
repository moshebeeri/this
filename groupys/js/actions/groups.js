/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 12/06/2017.
 */

import GroupsApi from "../api/groups"
let groupsApi = new GroupsApi();

import FeedApi from "../api/feed"
let feedApi = new FeedApi();
import UserApi from "../api/user"

let userApi = new UserApi();
import store from 'react-native-simple-store';

import * as actions from '../reducers/reducerActions';
async function getAll(dispatch,token){
    try {
        let response = await groupsApi.getAll(token);
        if(response.length > 0) {
            response.forEach(function (group) {
                dispatch({
                    type: actions.UPSERT_GROUP,
                    group: group,

                });
            })

        }


    }catch (error){
        console.log(error);
    }

}


async function getByBusinessId(dispatch,bid){
    try {
        let response = await groupsApi.getByBusinessId(bid,token);
        if(response.length > 0) {

            dispatch({
                type: 'GET_GROUPS_BUSINESS',
                groups: response,
                bid:bid
            });
        }


    }catch (error){
        console.log(error);
    }

}



async function getUserFollowers(dispatch,token){
    try {
        let users = await userApi.getUserFollowers(token);

        dispatch({
            type: 'GET_USER_FOLLOWERS',
            followers: users

        });



    }catch (error){
        console.log(error);
    }

}

export function fetchGroups(){
    return function (dispatch, getState){
        const token = getState().authentication.token
        dispatch|(getAll(dispatch,token));
    }

}


export function fetchBusinessGroups(bid){
    return function (dispatch, getState){
        const token = getState().authentication.token
        dispatch|(getByBusinessId(dispatch,bid,token));
    }

}

export function fetchUsersFollowers(){
    return function (dispatch, getState){
        const token = getState().authentication.token
        dispatch|(getUserFollowers(dispatch,token));
    }

}

export function acceptInvatation(group){
    return async function (dispatch, getState){
        const token = getState().authentication.token
        await groupsApi.acceptInvatation(group,token)
        let groups =  await groupsApi.getAll(token);
        groups.forEach(function (group) {
            dispatch({
                type: actions.UPSERT_GROUP,
                item: group

            });
        })


    }
}
export function touch(groupid){

    return  function (dispatch, getState){
        const token = getState().authentication.token
         groupsApi.touch(groupid,token);

    }
}
export function createGroup(group){

    return  async function (dispatch, getState){
        const token = getState().authentication.token
        await groupsApi.createGroup(group,uploadGroupPic,token);
        getAll(dispatch,token);
    }
}

function uploadGroupPic(){
    return  function (dispatch, getState){
         const token = getState().authentication.token
         getAll(dispatch,token);

    }
}


export function setNextFeeds(feeds,token,group){

    return  async function (dispatch, getState){
        const token = getState().authentication.token
        let showLoadingDone = false;
        if( _.isEmpty(feeds)) {
            dispatch({
                type: actions.GROUP_FEED_LOADING_DONE,
                loadingDone: false,
                groupId:group._id,

            });
            showLoadingDone = true;
        }
        try {

            let response = null;
            if( _.isEmpty(feeds)){
                response =  await feedApi.getAll('down','start',token,group);
            }else{
                let filteredFeeds = feeds.filter(function (feed) {
                            return feed.id != '100'

                        })
                let keys = Object.keys(filteredFeeds)
                let id = keys[keys.length-1]
                response =  await feedApi.getAll('down',filteredFeeds[id].fid,token,group);
            }

            if(response){
                response.forEach(item => dispatch({
                    type: actions.UPSERT_GROUP_FEEDS,
                    groupId:group._id,
                    groupFeed:item
                }))

            }



        }catch (error){
            console.log('error')
        }

        if(showLoadingDone) {
            dispatch({
                type: actions.GROUP_FEED_LOADING_DONE,
                loadingDone: true,
                groupId:group._id,

            });
        }
    }
}
