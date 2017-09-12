/**
 * Created by roilandshut on 12/06/2017.
 */

import BusinessApi from "../api/business"
let businessApi = new BusinessApi();
import UserApi from "../api/user"
let userApi = new UserApi();
import  ProductApi from "../api/product"
let productApi = new ProductApi();

import * as actions from '../reducers/reducerActions';

async function getAll(dispatch,token){
    try {
       let response = await businessApi.getAll(token);
        if(response.length > 0) {

            dispatch({
                type: 'GET_BUSINESS',
                businesses: response,

            });
        }



    }catch (error){
        console.log(error);
    }

}

async function getBusinessCategories(dispatch,gid,token) {
    try {
        let response = await businessApi.getBusinessCategories(gid,token);


        dispatch({
            type: 'GET_BUSINESS_CATEGORIES',
            categories: response,
            language:'en',
            catId:gid

        });



    } catch (error) {
        console.log(error);
    }
}

async function dispatchSearchBusiness(dispatch,business,token){
    dispatch({ type: actions.SHOW_SEARCH_SPIN, searching: true })
    dispatch({ type: actions.SHOW_CAMERA, cameraOn: false })
    let response = await businessApi.searchBusiness(business,token)
    dispatch({ type: actions.SEARCH_BUSINESS, businesses: response })
    dispatch({ type: actions.SHOW_SEARCH_SPIN, searching: false })

}



async function dispatchFollowByQrcode(dispatch,barcode,token){
    dispatch({ type: actions.SHOW_SEARCH_SPIN, searching: true })
    dispatch({ type: actions.SHOW_CAMERA, cameraOn: false })

    if(barcode.type && barcode.type == 'QR_CODE'){
        let data = JSON.parse(barcode.data);
        if(data.code) {
            let response =  await businessApi.searchBusinessByCode(data.code,token);
            if(response && response.assignment  && response.assignment.business ) {
                dispatch({ type: actions.SEARCH_BUSINESS, businesses: [response.assignment.business] })

            }else{
                dispatch({ type: actions.SEARCH_BUSINESS, businesses: [] })

            }
        }
    }
    dispatch({ type: actions.SHOW_SEARCH_SPIN, searching: false })
}


export function searchBusiness(business){
    return function (dispatch, getState){
        const token = getState().authentication.token

        dispatch|(dispatchSearchBusiness(dispatch,business,token));
    }
}

export function followByQrCode(barcode){
    return function (dispatch, getState){
        const token = getState().authentication.token

        dispatch|(dispatchFollowByQrcode(dispatch,barcode,token));
    }
}

export function showCamera(){
    return function (dispatch, getState){
        dispatch({ type: actions.SHOW_CAMERA, cameraOn: true })

    }
}



export function onEndReached(){
    return async function (dispatch, getState){
        const token = getState().authentication.token

        let businesses = await businessApi.getAll(token);
        businesses.forEach(function (business) {
            dispatch({
                type: actions.UPSERT_MY_BUSINESS,
                item: business

            });
        })

    }

}
 export function followBusiness(bussinesId){
     return function (dispatch, getState){
         const token = getState().authentication.token

         businessApi.followBusiness(bussinesId,token);
     }

 }


export function fetchBusinessCategories(gid){
    return function (dispatch, getState){
        const token = getState().authentication.token

        dispatch|(getBusinessCategories(dispatch,gid,token));
    }

}
export function setBusinessUsers(businessId){
    return async function (dispatch, getState){
        const token = getState().authentication.token

        try {
            let users = await userApi.getBusinessUsers(businessId,token);

            dispatch({
                type: actions.SET_USER_BUSINESS,
                businessUsers: users,
                businessId:businessId

            });



        }catch (error){
            //TODO dispacth network offline
            console.log(error);
        }
    }

}

export function setBusinessProducts(businessId){
    return async function (dispatch, getState){
        const token = getState().authentication.token

        try {
            let products = await productApi.findByBusinessId(businessId,token);

            dispatch({
                type: actions.SET_PRODUCT_BUSINESS,
                businessProducts: products,
                businessId:businessId

            });



        }catch (error){
            //TODO dispacth network offline
            console.log(error);
        }
    }

}
