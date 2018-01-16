/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {
    failedMessage: '',
    focusName: true,
    focusLastname: false,
    focusPhone: false,
    focusPassword: false,
    signupProcess: false
};
import * as actions from './../reducerActions';
import {REHYDRATE} from 'redux-persist/constants'

export default function signupForm(state = initialState, action) {
    console.log(action.type);
    switch (action.type) {


        case actions.SIGNUP_PROCESS :
            return {
                ...state,
                signupProcess: action.value,
            };
        case actions.SIGNUP_FAILED :
            return {
                ...state,
                failedMessage: action.failedMessage,
            };
        case actions.SIGNUP_SUCSESS :
            return {
                ...state,
                failedMessage: '',
            };
        case actions.SIGNUP_FOCUS_LASTNAME :
            return {
                ...state,
                focusPassword: false,
                focusPhone: false,
                focusName: false,
                focusLastname: true,
            };
        case actions.SIGNUP_FOCUS_PASSWORD :
            return {
                ...state,
                focusPassword: true,
                focusPhone: false,
                focusName: false,
                focusLastname: false,
            };
        case actions.SIGNUP_FOCUS_PHONE :
            return {
                ...state,
                focusPassword: false,
                focusPhone: true,
                focusName: false,
                focusLastname: false,
            };
        default:
            return state;
    }
};