/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 12/06/2017.
 */

import GroupsApi from "../api/groups"
let groupsApi = new GroupsApi();

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