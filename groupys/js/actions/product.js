/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 12/06/2017.
 */

import ProdictApi from "../api/product"
let productApi = new ProdictApi();

async function getAll(dispatch){
    try {
        let response = await productApi.getAll();
        if(response.length > 0) {

            dispatch({
                type: 'GET_PRODUCTS',
                products: response,

            });
        }


    }catch (error){
        console.log(error);
    }

}

async function getAllByBusinessId(dispatch,id) {
    try {
        let response = await productApi.findByBusinessId(id);
        if (response.length > 0) {

            dispatch({
                type: 'GET_BUSINESS_PRODUCTS',
                products: response,
                businessId:id

            });
        }


    } catch (error) {
        console.log(error);
    }
}


async function getProductCategories(dispatch) {
    try {
        let response = await productApi.getProductCategories()


            dispatch({
                type: 'GET_PRODUCT_CATEGORIES',
                categories: response,

            });



    } catch (error) {
        console.log(error);
    }
}

export function fetchProducts(){
    return function (dispatch, getState){
        dispatch|(getAll(dispatch));
    }

}

export function fetchProductsByBusiness(businessId){
    return function (dispatch, getState){
        dispatch|(getAllByBusinessId(dispatch,businessId));
    }

}

export function fetchProductCategories(){
    return function (dispatch, getState){
        dispatch|(getProductCategories(dispatch));
    }

}