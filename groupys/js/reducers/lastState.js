/**
 * Created by roilandshut on 03/09/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {};
import { REHYDRATE } from 'redux-persist/constants'

export default function lastState(state = initialState, action) {
    if (action.type === REHYDRATE){

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;

        return {
            ...state, ...savedData
        };
    }
    return state;
};