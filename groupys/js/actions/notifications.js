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
import store from 'react-native-simple-store';


async function getAll(dispatch){
    try {
        let response = await notificationApi.getAll();
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

async function getAllGroups(dispatch){
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

export function fetchNotification(){
    return function (dispatch, getState){
        dispatch|(getAll(dispatch));
    }

}
export function fetchGroups(){
    return function (dispatch, getState){
        dispatch|(getAllGroups(dispatch));
    }

}

