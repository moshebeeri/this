const initialState = {instance: {}};
import * as actions from "./../reducerActions";

export default function scanQrcodeForm(state = initialState, action) {
    switch (action.type) {
        case actions. SCAN_QRCODE_INSTANCE :
            return {
                ...state,
                instance: action.instance,
            };
        case actions.SCAN_QRCODE_CLEAR :
            return {
                ...state,
                instance: {},
            };
        default:
            return state;
    }
};