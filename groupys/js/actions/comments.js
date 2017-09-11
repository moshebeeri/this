/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 12/06/2017.
 */

import CommentsApi from "../api/commet"
let commentsApi = new CommentsApi();

import store from 'react-native-simple-store';

async function getInstanceGroupComments(dispatch,group,instance,size,token){
    try {
        let response = await commentsApi.getInstanceGroupComments(group,instance,size,token);
        if(response.length > 0) {

            dispatch({
                type: 'GET_INSTANCE_GROUP_COMMENTS',
                comments: response,
                gid:group,
                instanceId:instance


            });
        }


    }catch (error){
        console.log(error);
    }

}

async function getGroupComments(dispatch,group,token){
    try {
        let response = await commentsApi.getGroupComments(group,token);
        if(response.length > 0) {

            dispatch({
                type: 'GET_GROUP_COMMENTS',
                groupcomments: response,
                gid:group,



            });
        }


    }catch (error){
        console.log(error);
    }

}



async function getEntityComments(dispatch,entities,id,token){
    try {
        let response = await commentsApi.getComment(entities,token);

            dispatch({
                type: 'GET_COMMENTS',
                comments: response,
                id:id,



            });



    }catch (error){
        console.log(error);
    }

}





export function fetchInstanceGroupComments( group,instance,size){
    return function (dispatch){
        const token = getState().authentication.token
        dispatch|(getInstanceGroupComments(dispatch,group,instance,size,token));
    }

}

export function fetchEntityComments( entities,id){
    return function (dispatch){
        const token = getState().authentication.token
        dispatch|(getEntityComments(dispatch,entities,id,token));
    }

}



export function updateEntityComments(id,comment){
    return function (dispatch){
        dispatch({
            type: 'UPDATE_COMMENTS',
            comment: comment,
            id:id,



        });
    }

}

export function updateInstanceEntityComments(group,instance,comment){
    return function (dispatch){
        dispatch({
            type: 'UPDATE_INSTANCE_COMMENTS',
            comment: comment,
            gid:group,
            instanceId:instance

        });
    }

}



export function fetchGroupComments( group){
    return function (dispatch){
        const token = getState().authentication.token
        dispatch|(getGroupComments(dispatch,group,token));
    }

}
