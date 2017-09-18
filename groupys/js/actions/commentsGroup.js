/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 12/06/2017.
 */

import CommentsApi from "../api/commet"
let commentsApi = new CommentsApi();


import * as actions from '../reducers/reducerActions';



export function fetchTop(feeds,token,entity,group){

    return fetchTopComments(group,entity);
}
export function fetchTopComments( group,instance){



    return async function (dispatch,getState){
        const token = getState().authentication.token
        if(getState().commentInstances.groupLastCall[group._id] && getState().commentInstances.groupLastCall[group._id][instance.id]){

            if(new Date().getTime() - new Date(getState().commentInstances.groupLastCall[group._id][instance.id]).getTime() < 10000){


                return;
            }

        }

        let response = await commentsApi.getInstanceGroupComments(group._id, instance.id, 0, token);
        dispatch({
            type: actions.GROUP_COMMENT_INSTANCE_LOADING_DONE,
            loadingDone: true,
            gid: group._id,
            instanceId: instance.id

        });

        dispatch({
            type: actions.GROUP_COMMENT_INSTANCE_CLEAR_MESSAGE,
            groupId:group._id,
            instanceId:instance.id

        });
        if(response.length > 0) {

            response.forEach(item => dispatch({
                type: actions.UPSERT_GROUP_INSTANCE_TOP_COMMENT,
                item: item,
                gid: group._id,
                instanceId:instance.id
            }))

            dispatch({
                type: actions.GROUP_COMMENT_INSTANCE_LAST_CALL,
                lastCall: new Date(),
                gid:group._id,
                instanceId:instance.id

            });
        }


    }

}

export function sendMessage(groupId,instanceId,message) {

    return async function (dispatch, getState) {
        const token = getState().authentication.token
        const user = getState().authentication.user
        try {
            commentsApi.createComment(groupId, instanceId,message,token)

        }catch (error){
            //TODO dispatch network failed event
        }

        let messageItem = createMessage(message,user)
        dispatch({
            type: actions.GROUP_COMMENT_INSTANCE_ADD_MESSAGE,
            instanceId:instanceId,
            groupId:groupId,
            message:messageItem

        });

    }
}

function createMessage(message,user) {
    return {
        activity: {
            actor_user: user,
            message: message,
            action: 'group_message',
            timestamp: new Date().toLocaleString(),
        },
        _id: Math.random(),

    }
}
export function setNextFeeds(comments,group,instance){
    return async function (dispatch,getState){
        const token = getState().authentication.token
        const user = getState().authentication.user
        if(!user)
            return

        if(getState().commentInstances.groupLastCall[group._id] && getState().commentInstances.groupLastCall[group._id][instance.id]){

            if(new Date().getTime() - new Date(getState().commentInstances.groupLastCall[group._id][instance.id]).getTime() < 10000){


                return;
                }

        }
        let showLoadingDone = false;


        let response = undefined
        if( comments && comments.length > 0) {
            response = await commentsApi.getInstanceGroupComments(group._id,instance.id,comments.length ,token);
        }else {
            response = await commentsApi.getInstanceGroupComments(group._id, instance.id, 0, token);
        }


        dispatch({
            type: actions.GROUP_COMMENT_INSTANCE_LOADING_DONE,
            loadingDone: true,
            gid: group._id,
            instanceId: instance.id

        });





        if(response.length > 0) {

            response.forEach(item => dispatch({
                type: actions.UPSERT_GROUP_INSTANCE_COMMENT,
                item: item,
                gid: group._id,
                instanceId:instance.id
            }))

            dispatch({
                type: actions.GROUP_COMMENT_INSTANCE_LAST_CALL,
                lastCall: new Date(),
                gid:group._id,
                instanceId:instance.id

            });
        }

    }
}