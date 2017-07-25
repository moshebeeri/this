/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {user:[],followers:[]};



export default function user(state = initialState, action) {
    console.log(action.type);
    switch (action.type) {

        case 'GET_USER' :
            return {
                ...state,
                user : action.user,
            };

        case 'GET_USER_FOLLOWERS':
            return {
                ...state,
                followers : action.followers,
            };

        default:
            return state;
    }
};/**
 * Created by roilandshut on 13/06/2017.
 */
