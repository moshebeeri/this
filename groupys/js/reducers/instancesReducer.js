/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {instances:{}};

import store from 'react-native-simple-store';
import { REHYDRATE } from 'redux-persist/constants'
import * as actions from './reducerActions';
export default function instances(state = initialState, action) {

    if (action.type === REHYDRATE){

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;

        return {
            ...state, ...savedData.instances
        };
    }
    let currentState = {...state};
    console.log(action.type);
    switch (action.type) {
        case actions.UPSERT_INSTANCE:
            let currentInstances= currentState.instances;

            currentInstances[action.item._id] = action.item;
            return currentState;

        default:
            return state;
    }
};