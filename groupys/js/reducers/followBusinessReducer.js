const initialState = {businesses: [], cameraOn: false, searching: false, showSearchResults: false,searchPlaceHolder:'',searchType:''};
import * as actions from "./reducerActions";

export default function business(state = initialState, action) {
    switch (action.type) {
        case actions.SEARCH_BUSINESS:
            return {
                ...state,
                businesses: action.businesses,
                showSearchResults: true,
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
                searchType:'',
                searchPlaceHolder:'',
                businesses: []
            };
        default:
            return state;
    }
};