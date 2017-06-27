/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {promotions:[]};



export default function promotion(state = initialState, action) {
    console.log(action.type);
    switch (action.type) {

        case 'GET_PROMOTIONS' :


            let currentState = {...state};
            currentState['promotions'+ action.businessId] = action.promotions;

            return currentState;


        default:
            return state;
    }
};