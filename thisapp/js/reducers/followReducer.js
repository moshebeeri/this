const initialState = {followBusiness: [], followGroup: [],};
import * as actions from './reducerActions';
import {REHYDRATE} from 'redux-persist/constants'

export default function following(state = initialState, action) {
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.following
        };
    }
    let followState = {...state};
    switch (action.type) {
        case actions.USER_FOLLOW_BUSINESS:
            if( !followState.followBusiness.includes(action.id)) {
                followState.followBusiness.push(action.id);
            }
            return followState;
        case actions.USER_UNFOLLOW_BUSINESS:
            if( followState.followBusiness.includes(action.id)) {
                followState.followBusiness = followState.followBusiness.filter(id => { return action.id !== id});
            }
            return followState;

        case actions.USER_FOLLOW_GROUP:
            if( !followState.followGroup.includes(action.id)) {
                followState.followGroup.push(action.id);
            }
            return followState;
        case actions.USER_UNFOLLOW_GROUP:
            if( followState.followGroup.includes(action.id)) {
                followState.followGroup = followState.followGroup.filter(id => { return action.id !== id});
            }
            return followState;
        default:
            return state;
    }
};