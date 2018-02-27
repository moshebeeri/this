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
import userBusinessesByPhone from './form/userBusinessesByPhoneReducer'
import network from './networkReducer'
import myPromotions from './MyPromotionsReducer'
import commentInstances from './commenInstancesReducer'
import entityComments from './commentEntityReducer'
import contacts from './contactReducer'
import changePasswordForm from './form/changePasswordReducer'
import scanQrcodeForm from './form/scanQrcodeReducer'
import addressForm from './form/addressReducer'
import categoriesForm from './form/categoriesReducer'
import scannerForm from './form/scannerReducer'
import postForm from './form/postReducer';
import phone from './phoneReducer';
import render from './RenderReducer'
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
        userBusinessesByPhone: userBusinessesByPhone,
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
        changePasswordForm: changePasswordForm,
        scanQrcodeForm:scanQrcodeForm,
        addressForm:addressForm,
        categoriesForm:categoriesForm,
        phone:phone,
        render:render,
        scannerForm:scannerForm,
        postForm:postForm
    });
}
