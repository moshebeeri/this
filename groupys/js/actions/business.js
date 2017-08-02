/**
 * Created by roilandshut on 12/06/2017.
 */

import BusinessApi from "../api/business"
let businessApi = new BusinessApi();
import store from 'react-native-simple-store';
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

async function getAllFromStore(dispatch){
    try {
        let response = await store.get('businesses');
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


export function fetchBusiness(){
    return function (dispatch, getState){
        dispatch|(getAll(dispatch));
    }

}
export function fetchBusinessFromStore(){
    return function (dispatch, getState){
        dispatch|(getAllFromStore(dispatch));
    }

}


export function fetchBusinessCategories(gid){
    return function (dispatch, getState){
        dispatch|(getBusinessCategories(dispatch,gid));
    }

}