/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {selectedTab:0,showAdd:false};

import * as actions from './../reducerActions';
import { REHYDRATE } from 'redux-persist/constants'

export default function mainTab(state = initialState, action) {

    switch (action.type) {

        case actions.APP_CHANGE_TAB :
            return {
                ...state,

                selectedTab : action.selectedTab,
            };
        case actions.APP_SHOW_ADD_FAB :
            return {
                ...state,

                showAdd : action.showAdd,
            };


        default:
            return state;
    }
};