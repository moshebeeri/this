/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {groups:[]};



export default function group(state = initialState, action) {
    console.log(action.type);
    switch (action.type) {

        case 'GET_GROUPS' :
            return {
                ...state,
                groups : action.groups,
            };


        default:
            return state;
    }
};