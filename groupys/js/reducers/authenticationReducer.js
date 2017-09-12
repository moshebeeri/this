/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {authentication:'',token:'',init:false,user:undefined};

import * as actions from './reducerActions';
import { REHYDRATE } from 'redux-persist/constants'

export default function authentication(state = initialState, action) {
    console.log(action.type);
    if (action.type === REHYDRATE){

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;

        if(savedData.authentication) {
            return {
                ...state,
                token: savedData.authentication.token,
                user: savedData.authentication.user,
                init: true,
            };
        }else{
            return {
                ...state,
                init: true,
            };
        }

    }
    switch (action.type) {

        case actions.SAVE_USER_TOKEN :
            return {
                ...state,

                token : action.token,
            };
        case actions.SAVE_APP_USER :
            return {
                ...state,

                user : action.user,
            };


        default:
            return state;
    }
};