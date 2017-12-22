
const initialState = {
    business: undefined,
    instance:undefined,
    searching: false,
    cameraOn: true,
    submitable:false,
    showAssigmentMessage:false,
    code:'',
    location:'',

};
import * as actions from './../reducerActions';

export default function scannerForm(state = initialState, action) {

    switch (action.type) {
        case actions.SCANNER_RESET :
            return {
                ...state,
                business: undefined,
                instance:undefined,
                showAssigmentMessage:false,
                searching:false,
                cameraOn:true,
                code:''
            };
        case actions.SCANNER_SHOW_SEARCH_SPIN:
            return {
                ...state,
                searching: action.searching,

            };

        case actions.SCANNER_SHOW_PROMOTION:
            return {
                ...state,
                instance: action.instance,
                searching:false,

            };
        case actions.SCANNER_SHOW_QRCODE_ASSIGMENT:
            return {
                ...state,
                showAssigmentMessage:true,

            };

        case actions.SCANNER_CODE:
            return {
                ...state,
                code: action.code,

            };

        case actions.SCANNER_SHOW_BUSINESS:
            return {
                ...state,
                business: action.business,
                searching:false,

            };

        case actions.SCANNER_SHOW_CAMERA:
            return {
                ...state,
                cameraOn: action.cameraOn,

            };
        default:
            return state;
    }
};