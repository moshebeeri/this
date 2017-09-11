/**
 * Created by roilandshut on 06/09/2017.
 */


import { createSelector } from 'reselect'




const getStateMyBusinesses = (state) => state.businesses.myBusinesses



export const getMyBusinesses= createSelector(  [getStateMyBusinesses ],
    (myBusinesses) => {


        if (!_.isEmpty(myBusinesses)) {
            return  Object.keys(myBusinesses).map(key => myBusinesses[key])

        }
        return new Array();

    })