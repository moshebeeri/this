const initialState = {
    businesses: [],
    groups: [],
    cameraOn: false,
    searching: false,
    howSearchResults: false,
    searchPlaceHolder: '', searchType: ''
};
import * as actions from "./reducerActions";

export default function business(state = initialState, action) {
    switch (action.type) {
        case actions.SEARCH_BUSINESS:
            return {
                ...state,
                businesses: action.businesses,
                showSearchResults: true,
            };
        case actions.SEARCH_GROUPS:
            return {
                ...state,
                groups: action.groups,
                showSearchResults: true,
                searching:false,
            };
        case actions.SHOW_CAMERA :
            return {
                ...state,
                cameraOn: action.cameraOn,
            };
        case actions.SHOW_SEARCH_SPIN :
            return {
                ...state,
                searching: action.searching,
            }
        case actions.SEARCH_PARAMS :
            return {
                ...state,
                searchType: action.searchType,
                searchPlaceHolder: action.searchPlaceHolder,
            };
        case actions.RESET_FOLLOW_FORM :
            return {
                ...state,
                searching: false,
                cameraOn: false,
                showSearchResults: false,
                searchType: '',
                searchPlaceHolder: '',
                businesses: [],
                groups:[]
            };
        default:
            return state;
    }
};