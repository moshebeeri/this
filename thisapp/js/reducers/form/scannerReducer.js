const initialState = {
    business: undefined,
    instance: undefined,
    card: undefined,
    searching: false,
    cameraOn: true,
    submitable: false,
    showAssigmentMessage: false,
    notAuthotized: false,
    showAssigmentMessageFailed: false,
    conditionOutOfScope: false,
    code: '',
    followGroup: undefined,
    location: '',
};
import * as actions from './../reducerActions';

export default function scannerForm(state = initialState, action) {
    switch (action.type) {
        case actions.SCANNER_RESET :
            return {
                ...state,
                business: undefined,
                instance: undefined,
                followGroup: undefined,
                card: undefined,
                showAssigmentMessage: false,
                searching: false,
                cameraOn: true,
                notAuthotized: false,
                showAssigmentMessageFailed: false,
                conditionOutOfScope: false,
                code: ''
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
                searching: false,
            };
        case actions.SCANNER_SHOW_QRCODE_ASSIGMENT:
            return {
                ...state,
                showAssigmentMessage: true,
            };
        case actions.SCANNER_SHOW_QRCODE_ASSIGMEN_FAILED:
            return {
                ...state,
                showAssigmentMessageFailed: true,
            };
        case actions.SCANNER_CONDITION_OUT_OF_SCOPE:
            return {
                ...state,
                conditionOutOfScope: true,
            };
        case actions.SCANNER_SHOW_NOT_AUTHOTIZED:
            return {
                ...state,
                notAuthotized: true,
            };
        case actions.SCANNER_CODE:
            return {
                ...state,
                code: action.code,
            };
        case actions.SCANNER_SHOW_USER_CARD:
            return {
                ...state,
                card: action.card,
            };
        case actions.SCANNER_SHOW_BUSINESS:
            return {
                ...state,
                business: action.business,
                searching: false,
            };
        case actions.SCANNER_SHOW_GROUP:
            return {
                ...state,
                followGroup: action.group,
                searching: false,
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