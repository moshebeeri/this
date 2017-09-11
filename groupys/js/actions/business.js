/**
 * Created by roilandshut on 12/06/2017.
 */

import BusinessApi from "../api/business"
let businessApi = new BusinessApi();

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



export function setMyBusinesses(){
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