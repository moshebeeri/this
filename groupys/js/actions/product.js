/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 12/06/2017.
 */

import ProdictApi from "../api/product"
let productApi = new ProdictApi();
import EntityUtils from "../utils/createEntity";

let entityUtils = new EntityUtils();

import * as actions from '../reducers/reducerActions';
async function getAllByBusinessId(dispatch,id,token) {
    try {
        let response = await productApi.findByBusinessId(id,token);
        if (response.length > 0) {

            dispatch({
                type: 'GET_BUSINESS_PRODUCTS',
                products: response,
                businessId:id

            });
        }


    } catch (error) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
    }
}


async function getProductCategories(dispatch,gid,token) {

    try {
        if(gid) {
            let response = await productApi.getProductCategories(gid,token)
            if (response) {

                dispatch({
                    type: actions.SET_PRODUCT_CATEGORIES,
                    categories: response,
                    language: 'en',
                    catId: gid
                });


            }
        }
    } catch (error) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
    }
}

export function fetchProducts(){
    return function (dispatch, getState){
        const token = getState().authentication.token

        dispatch|(getAll(dispatch,token));
    }

}

export function fetchProductsByBusiness(businessId){
    return function (dispatch, getState){
        const token = getState().authentication.token
        dispatch|(getAllByBusinessId(dispatch,businessId,token));
    }

}



export function setProductCategories(gid){
    return function (dispatch, getState){
        const token = getState().authentication.token
        dispatch|(getProductCategories(dispatch,gid,token));
    }

}

export function saveProduct(product,saveSucsees,saveFailed){
    return function (dispatch, getState){
        try {
            const token = getState().authentication.token
            const user = getState().user.user
            entityUtils.create('products', product, token, saveSucsees, saveFailed, user._id);
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }

    }
}

export function updateProduct(product,saveSucsees,saveFailed,itemId){
    return function (dispatch, getState){
        try {
            const token = getState().authentication.token

            entityUtils.update('products', product, token, saveSucsees, saveFailed, itemId);
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }

    }
}




