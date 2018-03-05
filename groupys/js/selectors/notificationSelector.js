/**
 * Created by roilandshut on 06/09/2017.
 */
import {createSelector} from 'reselect'

const getStateNotification = (state) => state.notification;
export const getNotification = createSelector([getStateNotification],
    (notification) => {
        let notifications =  notification.notification;
        if (!_.isEmpty(notifications)) {
            return notifications.sort(function(a, b){
                return a._id < b._id  ;
            });
        }
        return [];
    });