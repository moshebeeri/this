/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 12/06/2017.
 */

import GroupsApi from "../api/groups"
let groupsApi = new GroupsApi();
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

