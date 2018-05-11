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
const initialState = {message: '', registerProcess: false, numberOfSms: 0, showResend: false};
import * as actions from './../reducerActions';

export default function registerForm(state = initialState, action) {
    switch (action.type) {
        case actions.REGISTER_PROCESS :
            return {
                ...state,
                registerProcess: action.value,
            };
        case actions.REGISTER_CODE_INVALID :
            return {
                ...state,
                message: action.message,
                showResend: true
            };
        case actions.REGISTER_RESEND :
            return {
                ...state,
                numberOfSms: state.numberOfSms +1,
            };
        case actions.REGISTER_CODE_SUCSSES :
            return {
                ...state,
                message: '',
            };
        default:
            return state;
    }
};