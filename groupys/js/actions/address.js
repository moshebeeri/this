import * as actions from "../reducers/reducerActions";
import BusinessApi from '../api/business'
let businessApi = new BusinessApi();
import ActionLogger from './ActionLogger'
let logger = new ActionLogger();

export function validateAddress(address) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            dispatch({
                type: actions.ADDRESS_VALADATING,
            });
            let response = await businessApi.checkAddress(address, token);
            dispatch({
                type: actions.ADDRESS_VALADATING_DONE,
            });
            if (!response.valid) {
                dispatch({
                    type: actions.ADDRESS_NOT_FOUND,
                    message: response.message
                });
                return;
            }
            if (response.results) {
                dispatch({
                    type: actions.ADDRESSES_MULTIPLE_FOUND,
                    locations: response.results
                });
                return;
            }
            dispatch({
                type: actions.ADDRESS_FOUND,
                location: {
                    lat: response.lat,
                    lng: response.lng
                }
            });
        }catch (error){
            logger.actionFailed('business_checkAddress');
            dispatch({
                type: actions.ADDRESS_NOT_FOUND,
                message: 'failed'
            });
        }
    }
}


export function addressChoose() {
    return function (dispatch) {
        dispatch({
            type: actions.ADDRESS_WAS_CHOOSEN,
        });
    }
}
export function resetForm() {
    return function (dispatch) {
        dispatch({
            type: actions.ADDRESS_RESET,
        });
    }
}
