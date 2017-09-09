/**
 * Created by roilandshut on 07/09/2017.
 */
/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {message:''};

import * as actions from './../reducerActions';
import { REHYDRATE } from 'redux-persist/constants'

export default function registerForm(state = initialState, action) {

    switch (action.type) {

        case actions.REGISTER_CODE_INVALID :
            return {
                ...state,

                message : action.message,
            };
        case actions.REGISTER_CODE_SUCSSES :
            return {
                ...state,

                message : '',
            };


        default:
            return state;
    }
};