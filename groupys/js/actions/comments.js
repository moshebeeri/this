/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 12/06/2017.
 */

import CommentsApi from "../api/commet"
let commentsApi = new CommentsApi();


import * as actions from '../reducers/reducerActions';

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
        let response = await commentsApi.getGroupComments(group,token,0,100);
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

export function fetchTop( group){
    return function (dispatch){
        const token = getState().authentication.token

    }

}
export function setNextFeeds(comments,token,group){
    return async function (dispatch,getState){
        const token = getState().authentication.token
        const user = getState().authentication.user
        if(!user)
            return

        if(getState().comments.lastCall[group._id]){
            if(new Date().getTime() - getState().comments.lastCall[group._id].getTime() < 10000){
                return;
            }
        }
        let showLoadingDone = false;
        if( _.isEmpty(comments)) {
            dispatch({
                type: actions.GROUP_COMMENT_LOADING_DONE,
                loadingDone: false,
                gid:group._id

            });
            showLoadingDone = true;
        }
        let response = undefined
        if( _.isEmpty(comments)) {
            response = await commentsApi.getGroupComments(group,token,0,10);
        }else{
            response = await commentsApi.getGroupComments(group,token,comments.length,comments.length + 10);


        }
        dispatch({
            type: actions.GROUP_COMMENT_LAST_CALL,
            lastCall: new Date(),
            gid:group._id

        });
        if(response.length == 0){
            if(showLoadingDone) {
                dispatch({
                    type: actions.GROUP_COMMENT_LOADING_DONE,
                    loadingDone: true,
                    gid:group._id

                });
            }
            return;
        }

        response.forEach(item => dispatch({
            type: actions.UPSERT_GROUP_COMMENT,
            item:item,
            gid:group._id,
        }))
        if(showLoadingDone) {
            dispatch({
                type: actions.GROUP_COMMENT_LOADING_DONE,
                loadingDone: true,
                gid:group._id

            });
        }
    }
}