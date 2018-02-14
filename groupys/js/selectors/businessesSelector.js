/**
 * Created by roilandshut on 06/09/2017.
 */
import {createSelector} from 'reselect'

const getStateMyBusinesses = (state) => state.businesses;
export const getMyBusinesses = createSelector([getStateMyBusinesses],
    (businesses) => {
        if (!_.isEmpty(businesses.myBusinesses)) {
            return Object.keys(businesses.myBusinesses).map(key => {
                let response = businesses.myBusinesses[key].business;
                response.key = key;
                return response;
            })
        }
        return [];
    });
export const getMyBusinessesItems = createSelector([getStateMyBusinesses],
    (businesses) => {
        if (!_.isEmpty(businesses.myBusinesses)) {

            return  businesses.myBusinessOrder.map(key => {
                let response = businesses.myBusinesses[key];
                if(!response){
                    return undefined
                }
                response.key = key;
                return response;
            }).filter((item) => item);
        }
        return [];
    });
export const getBusinessUsers = createSelector([getStateMyBusinesses],
    (businesses) => {
        if (!_.isEmpty(businesses.businessesUsers)) {
            return businesses.businessesUsers;
        }
        return new Map();
    });
export const getBusinessProducts = createSelector([getStateMyBusinesses],
    (businesses) => {
        if (!_.isEmpty(businesses.businessesProducts)) {

            let responseMap = {};
            Object.keys(businesses.businessesProducts).forEach(
                key => {
                    responseMap[key] = businesses.businessesProducts[key].sort(function(a,b){
                        if(a._id < b._id){
                            return 1
                        }
                        if(a._id > b._id){
                            return -1
                        }
                        return 0;
                    });
                }
            )
            return responseMap;
        }
        return new Map();
    });
export const getBusinessPromotions = createSelector([getStateMyBusinesses],
    (businesses) => {
        if (!_.isEmpty(businesses.businessesPromotions)) {
            let responseMap = {};
            Object.keys(businesses.businessesPromotions).forEach(
                key => {
                    responseMap[key] = businesses.businessesPromotions[key].sort(function(a,b){
                        if(a._id < b._id){
                            return 1
                        }
                        if(a._id > b._id){
                            return -1
                        }
                        return 0;
                    });
                }
            )
            return responseMap;
        }
        return new Map();
    });

