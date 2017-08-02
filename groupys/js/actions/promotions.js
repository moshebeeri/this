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
async function getAll(dispatch,id){
    try {
        let response = await promotionApi.getAllByBusinessId(id);
        if(response.length > 0) {

            dispatch({
                type: 'GET_PROMOTIONS',
                promotions: response,
                businessId: id

            });
        }


    }catch (error){
        console.log(error);
    }

}

async function getAllProducts(dispatch,id){
    try {
        let response = await productApi.findByBusinessId(id);
        if(response.length > 0) {

            dispatch({
                type: 'GET_BUSINESS_PRODUCTS',
                products: response,
                businessId: id

            });
        }


    }catch (error){
        console.log(error);
    }

}

async function getFromStorePromotions(dispatch,id){
    try {
        let response = await store.get('promotions'+id);
        if(response) {

            dispatch({
                type: 'GET_PROMOTIONS',
                products: response,
                businessId: id

            });
        }


    }catch (error){
        console.log(error);
    }

}

export function fetchPromotions(id){
    return function (dispatch, getState){
        dispatch|(getAll(dispatch,id));
    }

}

export function fetchFromStorePromotions(id){
    return function (dispatch, getState){
        dispatch|(getFromStorePromotions(dispatch,id));
    }

}
export function fetchProducts(id){
    return function (dispatch, getState){
        dispatch|(getAllProducts(dispatch,id));
    }

}