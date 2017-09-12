/**
 * Created by roilandshut on 06/09/2017.
 */


import { createSelector } from 'reselect'




const getStateGroups = (state) => state.groups



export const getGroups = createSelector(  [getStateGroups ],
    (groups) => {


        if (!_.isEmpty(groups.groups)) {
            return  Object.keys(groups.groups).map(key => groups.groups[key])

        }
        return new Array();

    })