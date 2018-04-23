import * as actions from './../reducerActions';

const initialState = {
    showSpinner: false,
    showMessage: false,
    message: '',
    user: undefined,
    info: undefined,
    selectedBusiness: undefined,

};

export default function userBusinessesByPhone(state = initialState, action) {
    switch (action.type) {
        case actions.USER_BUSINESS_BY_PHONE_CLEAR :
            return {
                ...state,
                showSpinner: false,
                showMessage: false,
                message: '',
                user: undefined,
                info: undefined,
                selectedBusiness: undefined,
            };
        case actions.USER_BUSINESS_BY_PHONE_SHOW_SPINNER :
            return {
                ...state,
                showSpinner: action.show,
            };
        case actions.USER_BUSINESS_BY_PHONE_SHOW_MESSAGE :
            return {
                ...state,
                showMessage: action.show,
                message: action.message,
            };
        case actions.USER_BUSINESS_BY_PHONE_SET_DATA :
            return {
                ...state,
                user: action.user,
                info: action.info,
            };
        default:
            return state;
    }
};