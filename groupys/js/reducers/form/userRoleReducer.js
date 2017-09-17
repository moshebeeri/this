/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {selectedUser:'',showSpinner:false,showMessage:false,message:'',user:'',fullUser:undefined,role:''};

import * as actions from './../reducerActions';
import { REHYDRATE } from 'redux-persist/constants'

export default function userRole(state = initialState, action) {

    switch (action.type) {

        case actions.USER_ROLE_CLEAR :
            return {
                ...state,

                showSpinner : false,
                selectedUser:'',
                message:'',
                showMessage:false,
                user:'',
                fullUser:undefined,
                role:''

            };

        case actions.USER_ROLE_SHOW_SPINNER :
            return {
                ...state,

                showSpinner : action.show,
            };
        case actions.USER_ROLE_SHOW_MESSAGE :
            return {
                ...state,

                showMessage : action.show,
                message : action.message,
            };
        case actions.USER_ROLE_SET_USER :
            return {
                ...state,
                user: action.user,
                fullUser:action.fullUser,
            };
        case actions.USER_SET_ROLE :

            return {
                ...state,
                role: action.role,

            };

//main tab

        default:
            return state;
    }
};