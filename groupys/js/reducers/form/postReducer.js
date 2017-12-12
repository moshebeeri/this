/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {failedMessage: '', saving: false,posts: {}, };
import * as actions from './../reducerActions';
import {REHYDRATE} from 'redux-persist/constants'

export default function postForm(state = initialState, action) {

    if (action.type === REHYDRATE) {

        // retrieve stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state,
            ...savedData.postForm,
        };
    }

    switch (action.type) {
        case actions.UPSERT_POST:
            let currentState = {...state};
            let currentPosts= currentState.posts;
            action.item.forEach(eventItem => {
                currentPosts[eventItem._id] = eventItem;
            });
            return currentState;
        case actions.RESET_POST_FORM:
            return {
                ...state,
                saving: action.false,
            };
        case actions.POST_SAVING :
            return {
                ...state,
                saving: true,
            };
        case actions.POST_SAVING_DONE :
            return {
                ...state,
                saving: false,
            };

        default:
            return state;
    }
};