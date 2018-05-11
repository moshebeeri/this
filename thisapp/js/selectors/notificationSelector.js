/**
 * Created by roilandshut on 06/09/2017.
 */
import {createSelector} from 'reselect'
import * as notificationTypes from "../components/notifications/list-view/notofications";
const getStateNotification = (state) => state.notification;
export const getNotification = createSelector([getStateNotification],
    (notification) => {
        let notifications =  notification.notification;
        if (!_.isEmpty(notifications)) {
            let results = notifications.filter(notification =>{
                if(notification.note === notificationTypes.ADD_BUSINESS_FOLLOW_ON_ACTION){
                    return true;
                }
                if(notification.note === notificationTypes.ADD_FOLLOW_PROMOTION){
                    return true;
                }
                if(notification.note === notificationTypes.ASK_GROUP_INVITATION){
                    return true;
                }
                if(notification.note === notificationTypes.APPROVE_GROUP_INVITATION){
                    return true;
                }
                return false;
            })
            return results.sort(function(a, b){
                if(a.read && !b.read){
                    return true;
                }
                if(!a.read && b.read){
                    return false;
                }
                return a._id < b._id  ;
            });
        }
        return [];
    });