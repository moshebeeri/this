/**
 * Created by roilandshut on 14/09/2017.
 */

import ProfilenApi from "../api/profile"
let profileApi = new ProfilenApi();

import * as actions from '../reducers/reducerActions';

export function setNextFeeds(feeds){
    return async function (dispatch,getState){
        const token = getState().authentication.token
        const user = getState().authentication.user
        if(!user)
            return
        let showLoadingDone = false;
        if( _.isEmpty(feeds)) {
            dispatch({
                type: actions.SAVED_FEED_LOADING_DONE,
                loadingDone: false,


            });
            showLoadingDone = true;
        }
        let response = undefined
        if(feeds && feeds.length > 0) {
            response =  await profileApi.fetch(feeds.length,feeds.length + 10)
        }else{
            response  = await profileApi.fetch(0,10);

        }
        if(response.length == 0){
            return;
        }

        response.forEach(item => dispatch({
            type: actions.UPSERT_SAVED_FEEDS,
            item:item
        }))
        if(showLoadingDone) {
            dispatch({
                type: actions.SAVED_FEED_LOADING_DONE,
                loadingDone: true,

            });
        }
    }
}