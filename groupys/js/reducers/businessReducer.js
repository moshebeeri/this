/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {businesses:[],categories:[]};



export default function business(state = initialState, action) {
    console.log(action.type);
    switch (action.type) {

        case 'GET_BUSINESS' :
            return {
                ...state,
                businesses : action.businesses,
            };
        case 'GET_BUSINESS_CATEGORIES' :
            return {
                ...state,
                categories : action.categories,
            };

        default:
            return state;
    }
};