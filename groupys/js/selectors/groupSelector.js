/**
 * Created by roilandshut on 06/09/2017.
 */
import {createSelector} from 'reselect'

const getStateGroups = (state) => state.groups.groups;

export const getGroups = createSelector([getStateGroups],
    (groups) => {
        if (!_.isEmpty(groups)) {
            let result =  Object.keys(groups).map(key => {
                let response = groups[key];
                return response;
            }).sort(function(a, b){
                return b.touched - a.touched;
            });
            return result;
        }
        return [];
    });