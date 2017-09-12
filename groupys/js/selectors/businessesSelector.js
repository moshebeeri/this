/**
 * Created by roilandshut on 06/09/2017.
 */


import { createSelector } from 'reselect'




const getStateMyBusinesses = (state) => state.businesses



export const getMyBusinesses= createSelector(  [getStateMyBusinesses ],
    (businesses) => {


        if (!_.isEmpty(businesses.myBusinesses)) {
            return  Object.keys(businesses.myBusinesses).map(key => businesses.myBusinesses[key].business)

        }
        return new Array();

    })

export const getMyBusinessesItems= createSelector(  [getStateMyBusinesses ],
    (businesses) => {


        if (!_.isEmpty(businesses.myBusinesses)) {
            return  Object.keys(businesses.myBusinesses).map(key => businesses.myBusinesses[key])

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