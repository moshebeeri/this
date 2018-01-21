
const initialState = {
    addressNotFound: false,
    addressNotFoundMessage:'',
    validating: false,
    locations: {},
    submitable:false,
    hasValidated:false,
    location:'',

};
import * as actions from './../reducerActions';

export default function addressForm(state = initialState, action) {

    switch (action.type) {
        case actions.ADDRESS_RESET :
            return {
                ...state,
                addressNotFound: false,
                validating: false,

                location:'',
                submitable:false
            };
        case actions.ADDRESS_NOT_FOUND :
            return {
                ...state,
                addressNotFound: true,
                addressNotFoundMessage: action.message
            };
        case actions.ADDRESS_VALADATING :
            return {
                ...state,
                validating: true,
            };
        case actions.ADDRESS_VALADATING_DONE :
            return {
                ...state,
                validating: false,
                hasValidated:true,
            };
        case actions.ADDRESSES_MULTIPLE_FOUND :
            return {
                ...state,
                addressNotFound: false,
                locations: action.locations,
            };
        case actions.ADDRESS_FOUND :
            return {
                ...state,
                submitable:true,
                addressNotFound: false,
                location: action.location,
            };
        case actions.ADDRESS_WAS_CHOOSEN:
            return {
                ...state,
                locations: {},
            };
        default:
            return state;
    }
};