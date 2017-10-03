/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {failedMessage: '', focusPhone: true, focusPassword: false};
import * as actions from './../reducerActions';
import {REHYDRATE} from 'redux-persist/constants'

export default function loginForm(state = initialState, action) {
    switch (action.type) {
        case actions.LOGIN_FAILED :
            return {
                ...state,
                failedMessage: action.message,
            };
        case actions.LOGIN_SUCSESS :
            return {
                ...state,
                failedMessage: '',
            };
        case actions.LOGIN_FOCUS_PASSWORD :
            return {
                ...state,
                focusPassword: true,
                focusPhone: false,
            };
        case actions.FOCUS_ :
            return {
                ...state,
                focusPassword: true,
                focusPhone: false,
            };
        case actions.LOGIN_FOCUSED_FIELD :
            return {
                ...state,
                focus: action.foucs,
            };
        default:
            return state;
    }
};