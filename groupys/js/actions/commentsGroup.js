/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 12/06/2017.
 */

import CommentsApi from "../api/commet"
let commentsApi = new CommentsApi();


import * as actions from '../reducers/reducerActions';




export function fetchTop( group){
    return function (dispatch){
        const token = getState().authentication.token

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