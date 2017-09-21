/**
 * Created by roilandshut on 06/09/2017.
 */


import { createSelector } from 'reselect'




const getStateMyBusinesses = (state) => state.businesses



export const getMyBusinesses= createSelector(  [getStateMyBusinesses ],
    (businesses) => {


        if (!_.isEmpty(businesses.myBusinesses)) {
            return  Object.keys(businesses.myBusinesses).map(key => {
                let response = businesses.myBusinesses[key].business
                response.key = key
                return response;
            })

        }
        return new Array();

    })

export const getMyBusinessesItems= createSelector(  [getStateMyBusinesses ],
    (businesses) => {


        if (!_.isEmpty(businesses.myBusinesses)) {
            return  Object.keys(businesses.myBusinesses).map(key => {
                let response = businesses.myBusinesses[key]
                response.key = key
                return response;
            })

        }
        return new Array();

    })

export const getBusinessUsers = createSelector(  [getStateMyBusinesses ],
    (businesses) => {


        if (!_.isEmpty(businesses.businessesUsers)) {
            return  businesses.businessesUsers;

        }
        return new Map();

    })

export const getBusinessProducts = createSelector(  [getStateMyBusinesses ],
    (businesses) => {


        if (!_.isEmpty(businesses.businessesProducts)) {
            return  businesses.businessesProducts;
            ;

        }
        return new Map();

    })


export const getBusinessPromotions = createSelector(  [getStateMyBusinesses ],
    (businesses) => {


        if (!_.isEmpty(businesses.businessesPromotions)) {
            return  businesses.businessesPromotions;

        }
        return new Map();

    })

