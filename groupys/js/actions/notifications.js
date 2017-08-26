/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 12/06/2017.
 */

import NotificationApi from "../api/notification"
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



export function fetchNotification(){
    return function (dispatch, getState){
        dispatch|(getAll(dispatch));
    }

}

