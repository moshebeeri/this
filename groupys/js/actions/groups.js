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

async function getGroupsFromStore(dispatch){
    try {
        let response = await store.get('groups');
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
async function getByBusinessId(dispatch,bid){
    try {
        let response = await groupsApi.getByBusinessId(bid);
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

export function fetchGroups(){
    return function (dispatch, getState){
        dispatch|(getAll(dispatch));
    }

}
export function fetchBusinessGroups(bid){
    return function (dispatch, getState){
        dispatch|(getByBusinessId(dispatch,bid));
    }

}

export function fetchUsersFollowers(){
    return function (dispatch, getState){
        dispatch|(getUserFollowers(dispatch,));
    }

}

export function fetchGroupsFromStore(){
    return function (dispatch, getState){
        dispatch|(getGroupsFromStore(dispatch,));
    }

}

