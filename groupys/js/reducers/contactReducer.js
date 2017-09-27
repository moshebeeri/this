/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {contacts:'',lastUpdate:undefined};

import * as actions from './reducerActions';
import { REHYDRATE } from 'redux-persist/constants'

export default function contacts(state = initialState, action) {
    if (action.type === REHYDRATE){

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;

        return {
            ...state, ...savedData.contacts
        };
    }
    switch (action.type) {

        case actions.LAST_CONTACT_SYNC :
            return {
                ...state,

                lastUpdate : action.lastUpdate,
            };
        case actions.SET_CONTACT :
            return {
                ...state,

                contacts : action.contacts,
            };


        default:
            return state;
    }
};