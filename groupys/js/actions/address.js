import * as actions from "../reducers/reducerActions";
import BusinessApi from '../api/business'
let businessApi = new BusinessApi();
import ActionLogger from './ActionLogger'
let logger = new ActionLogger();
import strings from "../i18n/i18n"
export function validateAddress(address,onValid) {
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
            if (response.message === 'No Content') {
                dispatch({
                    type: actions.ADDRESS_NOT_FOUND,
                    message: strings.AddressNotFound
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
            if(onValid){
                address.location = {
                    lat: response.lat,
                    lng: response.lng
                }
                onValid(address);
            }
        }catch (error){
            await logger.actionFailed('business_checkAddress');
            dispatch({
                type: actions.ADDRESS_NOT_FOUND,
                message: strings.AddressNotFound
            });
            dispatch({
                type: actions.ADDRESS_VALADATING_DONE,
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
export function addressChangeed() {
    return function (dispatch) {
        dispatch({
            type: actions.ADDRESS_CHANGE,
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
