/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {comments:[],groupComments:{},groupCommentsOrder:{},loadingDone:{},showTopLoader:{},update:false,lastCall:{}};

import { REHYDRATE } from 'redux-persist/constants'
import * as actions from './reducerActions';
export default function comment(state = initialState, action) {
    console.log(action.type);
    if (action.type === REHYDRATE){

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;

        return {
            ...state, ...savedData.comments
        };
    }
    let currentState = {...state};

    switch (action.type) {

        case actions.UPSERT_GROUP_COMMENT :
            let currentGroupComments = currentState.groupComments;
            if(!currentGroupComments[action.gid]){
                currentGroupComments[action.gid] ={}
            }

            currentGroupComments[action.gid][ action.item._id] = action.item;

            if(! currentState.groupCommentsOrder[action.gid]){
                currentState.groupCommentsOrder[action.gid] = new Array();
             }

            if (currentState.groupCommentsOrder[action.gid].includes(action.item._id)) {
                return state
            }

            currentState.groupCommentsOrder[action.gid].push(action.item._id);
            currentState.update=!currentState.update;
            return currentState;
        case actions.GROUP_COMMENT_LOADING_DONE:
            currentState.loadingDone[action.gid] =  action.loadingDone;
            return currentState;
        case actions.GROUP_COMMENT_LAST_CALL:
            currentState.lastCall[action.gid] =  action.lastCall;
            return currentState;
        case actions.GROUP_COMMENT_SHOW_TOP_LOADER:
            currentState.showTopLoader[action.gid] =  action.showTopLoader;
            return currentState;


        default:
            return state;
    }
};