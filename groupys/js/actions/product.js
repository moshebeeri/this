/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 12/06/2017.
 */

import ProdictApi from "../api/product"
let productApi = new ProdictApi();


async function getAll(dispatch,token){
    try {
        let response = await productApi.getAll(token);
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
        console.log(error);
    }
}


async function getProductCategories(dispatch,gid,token) {

    try {
        if(gid) {
            let response = await productApi.getProductCategories(gid,token)
            if (response) {

                dispatch({
                    type: 'GET_PRODUCT_CATEGORIES',
                    categories: response,
                    language: 'en',
                    catId: gid
                });


            }
        }
    } catch (error) {
        console.log(error);
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



export function fetchProductCategories(gid){
    return function (dispatch, getState){
        const token = getState().authentication.token
        dispatch|(getProductCategories(dispatch,gid,token));
    }

}