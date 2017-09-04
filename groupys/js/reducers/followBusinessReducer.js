/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {businesses:[],cameraOn:false,searching:false};

import * as actions from './reducerActions';


export default function business(state = initialState, action) {


    console.log(action.type);
    switch (action.type) {

        case actions.SEARCH_BUSINESS:
            return {
                ...state,
                businesses : action.businesses,
            };



        case actions.SHOW_CAMERA :
            return {
                ...state,
                cameraOn : action.cameraOn,
            };

        case actions.SHOW_SEARCH_SPIN :
            return {
                ...state,
                searching : action.searching,
            };

        default:
            return state;
    }
};