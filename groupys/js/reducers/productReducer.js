/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {products:[],categories:[]};



export default function products(state = initialState, action) {
    console.log(action.type);
    switch (action.type) {

        case 'GET_PRODUCTS' :
            return {
                ...state,
                products : action.products,
            };

        case 'GET_PRODUCT_CATEGORIES' :
            return {
                ...state,
                categories : action.categories,
            };

        case 'GET_BUSINESS_PRODUCTS' :

            let currentState = {...state};
            currentState['products'+ action.businessId] = action.products;

            return currentState;
        default:
            return state;
    }
};