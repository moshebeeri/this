/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {offline:{false}};

import * as actions from './reducerActions';


export default function network(state = initialState, action) {


    switch (action.type) {
        case actions.NETWORK_IS_ONLINE:
            return {
                ...state,
                offline : false,
            };
        case  actions.NETWORK_IS_OFFLINE:
            return {
                ...state,
                offline : true,
            };

        default:
            return state;
    }
};/**
 * Created by roilandshut on 13/06/2017.
 */
