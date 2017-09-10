/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 12/06/2017.
 */

import NotificationApi from "../api/notification"
import GroupsApi from "../api/groups"
let groupsApi = new GroupsApi();
let notificationApi = new NotificationApi();


async function getAll(dispatch,token,user){
    try {
        let response = await notificationApi.getAll(token,user);
        if(response.length > 0) {

            dispatch({
                type: 'GET_NOTIFICATION',
                notification: response,

            });
        }


    }catch (error){
        console.log(error);
    }

}




async function getAllGroups(dispatch,token){
    try {
        let response = await groupsApi.getAll(token);
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

export function fetchNotification(){
    return function (dispatch, getState){
        const token = getState().authentication.token
        const user = getState().authentication.user
        dispatch|(getAll(dispatch,token,user));
    }

}

export function fetchGroups(){
    return function (dispatch, getState){
        const token = getState().authentication.token

        dispatch|(getAllGroups(dispatch,token));
    }

}

