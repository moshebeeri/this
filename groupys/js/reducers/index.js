/**
 * Created by stan229 on 5/27/16.
 */
import {combineReducers} from "redux";
import feeds from "./feedReducer";
import businesses from "./businessReducer";
import groups from "./groupReducer";
import promotions from './promotionReducer';
import products from './productReducer';
import follow_businesses from './followBusinessReducer'
import user from './UserReducer';
import comments from './commentReducer';
import notification from './notificationReducer';
import instances from './instancesReducer';
import activities from './activitiesReducer';
import authentication from './authenticationReducer';
import mainTab from './form/mainAppReducer';
import loginForm from './form/loginReducer'
import registerForm from './form/registerReducer'
import signupForm from './form/signupReducer'
import userRole from './form/userRoleReducer'
import network from './networkReducer'
import myPromotions from './MyPromotionsReducer'
import commentInstances from './commenInstancesReducer'
import entityComments from './commentEntityReducer'
import contacts from './contactReducer'
import changePasswordForm from './form/changePasswordReducer'

export default function getRootReducer() {
    return combineReducers({
        feeds: feeds,
        businesses: businesses,
        follow_businesses: follow_businesses,
        groups: groups,
        promotions: promotions,
        products: products,
        user: user,
        userRole: userRole,
        notification: notification,
        comments: comments,
        instances: instances,
        mainTab: mainTab,
        activities: activities,
        authentication: authentication,
        loginForm: loginForm,
        registerForm: registerForm,
        network: network,
        signupForm: signupForm,
        myPromotions: myPromotions,
        entityComments: entityComments,
        commentInstances: commentInstances,
        contacts: contacts,
        changePasswordForm: changePasswordForm
    });
}
