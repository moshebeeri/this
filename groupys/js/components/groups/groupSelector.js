/**
 * Created by roilandshut on 06/09/2017.
 */


import { createSelector } from 'reselect'




const getStateGroups = (state) => state.groups.groups



export const getGroups = createSelector(  [getStateGroups ],
    (groups) => {


        if (!_.isEmpty(groups)) {
            return  Object.keys(groups).map(key => groups[key])

        }
        return new Array();

    })