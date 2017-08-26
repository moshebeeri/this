/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {notification:[]};
import store from 'react-native-simple-store';


export default function notification(state = initialState, action) {
    console.log(action.type);
    switch (action.type) {

        case 'GET_NOTIFICATION' :
            return {
                ...state,
                notification : action.notification,
            };


        default:
            return state;
    }
};