/**
 * Created by roilandshut on 12/06/2017.
 */

import BusinessApi from "../api/business"
let businessApi = new BusinessApi();

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

export function fetchBusiness(){
    return function (dispatch, getState){
        dispatch|(getAll(dispatch));
    }

}