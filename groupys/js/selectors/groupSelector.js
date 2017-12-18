/**
 * Created by roilandshut on 06/09/2017.
 */
import {createSelector} from 'reselect'

const getStateGroups = (state) => state.groups
const getStateComments = (state) => state.comments
export const getGroups = createSelector([getStateGroups,getStateComments],
    (groups,comments) => {
        if (!_.isEmpty(groups.groups)) {
            return Object.keys(groups.groups).map(key => {
                let response = groups.groups[key]
                if(groups.groupFeedsUnread[key]){
                    response.unreadFeeds = groups.groupFeedsUnread[key];
                }else{
                    response.unreadFeeds = 0;
                }

                if(comments.groupUnreadComments[key]){
                    response.unreadMessages = comments.groupUnreadComments[key];
                }
                else{
                    response.unreadMessages = 0;
                }
                response.key = key
                return response;
            }).sort(function(a, b){
                let aTouched = a.touched;
                if(!a.touched){
                    aTouched = 0;
                }
                let bTouched = b.touched;
                if(!b.touched){
                    bTouched = 0;
                }
                return bTouched - aTouched  ;
            });
        }
        return new Array();
    })