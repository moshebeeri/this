/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {groups:{}};


import store from 'react-native-simple-store';
import { REHYDRATE } from 'redux-persist/constants'
import * as actions from './reducerActions';
export default function group(state = initialState, action) {
    console.log(action.type);
    if (action.type === REHYDRATE){

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;

        return {
            ...state, ...savedData.groups
        };
    }

    let currentState = {...state};
    switch (action.type) {
        case actions.UPSERT_GROUP:
            let currentGroups = currentState.groups;

            currentGroups[action.item._id] = action.item;
            return currentState
        case 'GET_GROUPS' :
            store.save('groups',action.groups)

            return {
                ...state,
                groups : action.groups,
            };

        case 'GET_GROUPS_BUSINESS' :


            currentState['groups'+ action.bid] = action.groups;
            store.save('groups'+ action.bid,action.groups)
            return currentState;

        default:

            return state;
    }
};