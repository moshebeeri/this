/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 12/06/2017.
 */

import CommentsApi from "../api/commet"
let commentsApi = new CommentsApi();


import * as actions from '../reducers/reducerActions';



export function fetchTop(feeds,token,entities,generalId){

    return fetchTopComments(entities,generalId);
}
export function fetchTopComments( entities,generalId){



    return async function (dispatch,getState){
        try{
        const token = getState().authentication.token
        if(getState().entityComments.lastCall[generalId]){

            if(new Date().getTime() - new Date(getState().entityComments.lastCall[generalId]).getTime() < 10000){


                return;
            }

        }
        dispatch({
            type: actions.ENTITIES_COMMENT_LAST_CALL,
            lastCall: new Date(),
            generalId:generalId,

        });

        let response = await commentsApi.getComment(entities,token,0);
        dispatch({
            type: actions.ENTITIES_COMMENT_LOADING_DONE,
            loadingDone: true,
            generalId: generalId,

        });

        dispatch({
            type: actions.ENTITIES_COMMENT_INSTANCE_CLEAR_MESSAGE,
            generalId: generalId,

        });
        if(response.length > 0) {

            response.forEach(item => dispatch({
                type: actions.UPSERT_ENTITIES_TOP_COMMENT,
                item: item,
                generalId: generalId,
            }))


        }
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }


    }

}

export function sendMessage(entities,generalId,message) {

    return async function (dispatch, getState) {

        const token = getState().authentication.token
        const user = getState().authentication.user
        try {
            commentsApi.createGlobalComment(entities,message,token)

        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }

        let messageItem = createMessage(message,user)
        dispatch({
            type: actions.ENTITIES_COMMENT_INSTANCE_ADD_MESSAGE,
            generalId:generalId,
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
export function setNextFeeds(comments,entities,generalId){
    return async function (dispatch,getState){
        try {
            const token = getState().authentication.token
            const user = getState().authentication.user
            if (!user)
                return

            if (getState().entityComments.lastCall[generalId]) {

                if (new Date().getTime() - new Date(getState().entityComments.lastCall[generalId]).getTime() < 10000) {


                    return;
                }

            }
            let showLoadingDone = false;


            let response = undefined
            if (comments && comments.length > 0) {
                response = await commentsApi.getComment(entities, token, comments.length);
            } else {
                response = await commentsApi.getComment(entities, token, 0);
            }


            dispatch({
                type: actions.ENTITIES_COMMENT_LOADING_DONE,
                loadingDone: true,
                generalId: generalId


            });


            if (response.length > 0) {

                response.forEach(item => dispatch({
                    type: actions.UPSERT_ENTITIES_COMMENT,
                    item: item,
                    generalId: generalId,

                }))

                dispatch({
                    type: actions.ENTITIES_COMMENT_LAST_CALL,
                    lastCall: new Date(),
                    generalId: generalId,

                });
            }
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }

    }
}