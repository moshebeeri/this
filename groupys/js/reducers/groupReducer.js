/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {groups:{},update:false};


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
    let imutableState ={...state};
    let currentGroups= imutableState.groups;


    switch (action.type) {



        case actions.UPSERT_GROUP:

            currentGroups[action.group._id] = action.group;
            imutableState.update = !imutableState.update;
            return imutableState

        case 'GET_GROUPS_BUSINESS' :


            currentState['groups'+ action.bid] = action.groups;
            store.save('groups'+ action.bid,action.groups)
            return currentState;

        default:

            return state;
    }
};