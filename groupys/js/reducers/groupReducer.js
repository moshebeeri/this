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


import store from 'react-native-simple-store';

export default function group(state = initialState, action) {
    console.log(action.type);
    let currentState = {...state};
    switch (action.type) {

        case 'GET_GROUPS' :
            store.save('groups',action.groups)

            return {
                ...state,
                groups : action.groups,
            };

        case 'GET_GROUPS_BUSINESS' :


            currentState['groups'+ action.bid] = action.groups;
            store.save('groups'+ action.bid,action.groups)
            return currentState;

        default:

            return state;
    }
};