/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 12/06/2017.
 */

import PromotionsApi from "../api/promotion"
import ProductApi from "../api/product"
let promotionApi = new PromotionsApi();
let productApi = new ProductApi();
import store from 'react-native-simple-store';
async function getAll(dispatch,id,token){
    try {
        let response = await promotionApi.getAllByBusinessId(id,token);
        if(response.length > 0) {

            dispatch({
                type: 'GET_PROMOTIONS',
                promotions: response,
                businessId: id

            });
        }


    } catch (error) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
    }

}

async function getAllProducts(dispatch,id,token){
    try {
        let response = await productApi.findByBusinessId(id,token);
        if(response.length > 0) {

            dispatch({
                type: 'GET_BUSINESS_PRODUCTS',
                products: response,
                businessId: id

            });
        }


    } catch (error) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
    }

}


export function fetchPromotions(id){
    return function (dispatch, getState){
        const token = getState().authentication.token
        dispatch|(getAll(dispatch,id,token));
    }

}


export function fetchProducts(id){
    return function (dispatch, getState){
        const token = getState().authentication.token
        dispatch|(getAllProducts(dispatch,id,token));
    }

}