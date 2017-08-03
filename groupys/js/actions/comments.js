/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 12/06/2017.
 */

import CommentsApi from "../api/commet"
let commentsApi = new CommentsApi();

async function getInstanceGroupComments(dispatch,group,instance){
    try {
        let response = await commentsApi.getInstanceGroupComments(group,instance);
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

async function getGroupComments(dispatch,group){
    try {
        let response = await commentsApi.getGroupComments(group);
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

async function getEntityComments(dispatch,entities,id){
    try {
        let response = await commentsApi.getComment(entities);
        if(response.length > 0) {

            dispatch({
                type: 'GET_COMMENTS',
                comments: response,
                id:id,



            });
        }


    }catch (error){
        console.log(error);
    }

}




export function fetchInstanceGroupComments( group,instance){
    return function (dispatch){
        dispatch|(getInstanceGroupComments(dispatch,group,instance));
    }

}

export function fetchEntityComments( entities,id){
    return function (dispatch){
        dispatch|(getEntityComments(dispatch,entities,id));
    }

}



export function fetchGroupComments( group){
    return function (dispatch){
        dispatch|(getGroupComments(dispatch,group));
    }

}

