/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {users:{},followers:[],user:undefined};
import { REHYDRATE } from 'redux-persist/constants'
import * as actions from './reducerActions';


export default function user(state = initialState, action) {
    console.log(action.type);
    let extendedState = {...state};
    if (action.type === REHYDRATE){

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;

        return {
            ...state, ...savedData.users
        };
    }
    let userState = {...state};
    switch (action.type) {
        case actions.UPSERT_USER:
            let currentUsers =userState.users;

            currentUsers[action.item._id] = action.item;
            return userState;
        case  actions.SET_USER:
            return {
                ...state,
                user : action.user,
            };

        case actions.USER_FOLLOW:
            return {
                ...state,
                followers : action.followers,
            };
        case 'GET_USER_BUSINESS':

            extendedState['business'+ action.businessId] = action.businessUsers;
            return extendedState;
        default:
            return state;
    }
};/**
 * Created by roilandshut on 13/06/2017.
 */
