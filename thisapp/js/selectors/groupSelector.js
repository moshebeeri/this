/**
 * Created by roilandshut on 06/09/2017.
 */
import {createSelector} from 'reselect'

const getStateGroups = (state) => state.groups;
export const getGroups = createSelector([getStateGroups],
    (groups) => {
        if (!_.isEmpty(groups)) {
            let result = Object.keys(groups.groups).map(key => {
                let response = groups.groups[key];
                return response;
            }).filter(group => group).sort(function (a, b) {
                let lastAtouched = 0;
                let aCreated = new Date(a.created).getTime();
                if (a.touched) {
                    lastAtouched = a.touched;
                }
                if (aCreated> lastAtouched) {
                    lastAtouched = aCreated;
                }
                let bCreated = new Date(b.created).getTime();

                let lastBtouched = 0;
                if (b.touched) {
                    lastBtouched = b.touched;
                }
                if (bCreated > lastBtouched) {
                    lastBtouched = bCreated;
                }
                return lastBtouched - lastAtouched;
            });
            return result;
        }
        return [];
    });