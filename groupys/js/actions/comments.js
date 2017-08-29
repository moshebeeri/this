/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 12/06/2017.
 */

import CommentsApi from "../api/commet"
let commentsApi = new CommentsApi();

import store from 'react-native-simple-store';

async function getInstanceGroupComments(dispatch,group,instance,size){
    try {
        let response = await commentsApi.getInstanceGroupComments(group,instance,size);
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


async function getStoreSInstanceGroupComments(dispatch,group,instance){
    try {
        let response = await store.get('comment'+ group + instance);
        if(response && response.length > 0) {

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

async function getStoreGroupComments(dispatch,group){
    try {
        let response = await store.get('comment'+ group);
        if(response && response.length > 0) {

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

            dispatch({
                type: 'GET_COMMENTS',
                comments: response,
                id:id,



            });



    }catch (error){
        console.log(error);
    }

}

async function getStoreEntityComments(dispatch,entities,id){
    try {
        let response = await store.get('comment'+ id)
        if(response && response.length > 0) {

            dispatch({
                type: 'GET_COMMENTS',
                comments: response,
                id: id,


            });
        }



    }catch (error){
        console.log(error);
    }

}




export function fetchInstanceGroupComments( group,instance,size){
    return function (dispatch){
        dispatch|(getInstanceGroupComments(dispatch,group,instance,size));
    }

}


export function fetchStoreInstanceGroupComments( group,instance){
    return function (dispatch){
        dispatch|(getStoreSInstanceGroupComments(dispatch,group,instance));
    }

}

export function fetchEntityComments( entities,id){
    return function (dispatch){
        dispatch|(getEntityComments(dispatch,entities,id));
    }

}

export function fetchStoreEntityComments( entities,id){
    return function (dispatch){
        dispatch|(getStoreEntityComments(dispatch,entities,id));
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
        dispatch|(getGroupComments(dispatch,group));
    }

}

export function fetchStoreGroupComments( group){
    return function (dispatch){
        dispatch|(getStoreGroupComments(dispatch,group));
    }

}

