/**
 * Created by roilandshut on 12/06/2017.
 */

import BusinessApi from "../api/business"
let businessApi = new BusinessApi();

import * as actions from '../reducers/reducerActions';

async function getAll(dispatch){
    try {
       let response = await businessApi.getAll();
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


async function getBusinessCategories(dispatch,gid) {
    try {
        let response = await businessApi.getBusinessCategories(gid);


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

async function dispatchSearchBusiness(dispatch,business){
    dispatch({ type: actions.SHOW_SEARCH_SPIN, searching: true })
    dispatch({ type: actions.SHOW_CAMERA, cameraOn: false })
    let response = await businessApi.searchBusiness(business)
    dispatch({ type: actions.SEARCH_BUSINESS, businesses: response })
    dispatch({ type: actions.SHOW_SEARCH_SPIN, searching: false })

}



async function dispatchFollowByQrcode(dispatch,barcode){
    dispatch({ type: actions.SHOW_SEARCH_SPIN, searching: true })
    dispatch({ type: actions.SHOW_CAMERA, cameraOn: false })

    if(barcode.type && barcode.type == 'QR_CODE'){
        let data = JSON.parse(barcode.data);
        if(data.code) {
            let response =  await businessApi.searchBusinessByCode(data.code);
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
        dispatch|(dispatchSearchBusiness(dispatch,business));
    }
}

export function followByQrCode(barcode){
    return function (dispatch, getState){
        dispatch|(dispatchFollowByQrcode(dispatch,barcode));
    }
}

export function showCamera(){
    return function (dispatch, getState){
        dispatch({ type: actions.SHOW_CAMERA, cameraOn: true })

    }
}



export function fetchBusiness(){
    return function (dispatch, getState){
        dispatch|(getAll(dispatch));
    }

}
 export function followBusiness(bussinesId){
     businessApi.followBusiness(bussinesId);
 }


export function fetchBusinessCategories(gid){
    return function (dispatch, getState){
        dispatch|(getBusinessCategories(dispatch,gid));
    }

}