import UserApi from "../api/user";
import LoginAPI from "../api/login";
import * as actions from "../reducers/reducerActions";
import * as errors from "../api/Errors";
import simpleStore from 'react-native-simple-store';
import ActionLogger from './ActionLogger'
import strings from "../i18n/i18n"
let userApi = new UserApi();
let loginApi = new LoginAPI();
let logger = new ActionLogger();
import  handler from './ErrorHandler'

async function getUser(dispatch, token) {
    try {
        let user = await userApi.getUser(token);
        dispatch({
            type: actions.UPSERT_SINGLE_USER,
            item: user
        })
        simpleStore.save('user',user);
        dispatch({
            type: actions.SET_USER,
            user: user
        })
    } catch (error) {
         handler.handleError(error,dispatch)
        logger.actionFailed('users-getUser')
    }
}

async function getUserFollowers(dispatch, token) {
    try {
        let users = await userApi.getUserFollowers(token);
        dispatch({
            type: actions.USER_FOLLOW,
            followers: users
        });
    } catch (error) {
         handler.handleError(error,dispatch)
        logger.actionFailed('users-getUserFollowers')
    }
}

export function fetchUsers() {
    return function (dispatch, getState) {
        const token = getState().authentication.token
        if (token) {
            getUser(dispatch, token);
        }
    }
}

export function fetchUsersFollowers() {
    return function (dispatch, getState) {
        const token = getState().authentication.token
        if (token) {
            getUserFollowers(dispatch, token);
        }
    }
}

export function fetchUsersBusiness(business) {
    return function (dispatch, getState) {
        const token = getState().authentication.token
        getBusinssUsers(dispatch, business, token);
    }
}

export function changePassword(oldPassword, newPassword, navigation) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token
        const user = getState().user.user
        try {
            dispatch({
                type: actions.SAVING_USER,
            });
            let response = await loginApi.changePassword(oldPassword, newPassword, user._id, token);
            dispatch({
                type: actions.SAVING_USER_DONE,
            });
            if (response.response === true) {
                navigation.goBack();
            }
            handler.handleSuccses(getState(),dispatch)
        } catch (error) {
            if(error === errors.PASSOWRD_VALIDATION_FAILED){
                dispatch({
                    type: actions.CHANGE_PASSWORD_FAILED,
                    message: strings.OldPasswordValidationFailed
                });
            }else {
                handler.handleError(error, dispatch)
            }
            dispatch({
                type: actions.SAVING_USER_DONE,
            });
            logger.actionFailed('users-changePassword')
        }
    }
}

export function updateUser(newUser, navigation) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        const user = getState().user.user;
        try {
            dispatch({
                type: actions.SAVING_USER,
            });
            console.log('updating user')
            await userApi.saveUserDetails(newUser,user._id,token,dispatch);
            let updatedUser = await userApi.getUser(token);
            simpleStore.save('user',updatedUser);
            dispatch({
                type: actions.UPSERT_SINGLE_USER,
                item: updatedUser
            });
            dispatch({
                type: actions.SET_USER,
                user: updatedUser
            });
            if(navigation) {
                navigation.goBack();
            }
            dispatch({
                type: actions.SAVING_USER_DONE,
            });
            handler.handleSuccses(getState(),dispatch)
        } catch (error) {
            handler.handleError(error,dispatch)

            logger.actionFailed('users-updateUser')
        }
    }
}





export function resetPasswordForm() {
    return function (dispatch) {
        dispatch({
            type: actions.CHANGE_PASSWORD_CLEAR
        });
    }
}


 async function updateUserLocale(dispatch, token,user,locale) {
    try {
        if(!user.locale ||(user.locale  && user.locale!== locale)){
            dispatch({
                type: actions.SAVING_USER,
            });
            user.locale = locale;
            await userApi.saveUserDetails(user, user._id, token, dispatch);
            let updatedUser = await userApi.getUser(token);
            simpleStore.save('user',updatedUser);
            dispatch({
                type: actions.UPSERT_SINGLE_USER,
                item: updatedUser
            });
            dispatch({
                type: actions.SET_USER,
                user: updatedUser
            });
            dispatch({
                type: actions.SAVING_USER_DONE,
            });
        }

    } catch (error) {
         handler.handleError(error,dispatch)
        logger.actionFailed('users-updateUserLocale')
    }
}

async function updateUserToken(dispatch, token,user,fireBaseToken) {
    try {
        if(!user.firebase ||(user.firebase  && !user.firebase.tokens ) || (
            user.firebase && user.firebase.tokens && user.firebase.tokens[0] !== fireBaseToken
            )){
            dispatch({
                type: actions.SAVING_USER,
            });
            user.firebase = {tokens:[fireBaseToken]};
            await userApi.saveUserDetails(user, user._id, token, dispatch);
            let updatedUser = await userApi.getUser(token);
            simpleStore.save('user',updatedUser);
            dispatch({
                type: actions.UPSERT_SINGLE_USER,
                item: updatedUser
            });
            dispatch({
                type: actions.SET_USER,
                user: updatedUser
            });
            dispatch({
                type: actions.SAVING_USER_DONE,
            });
        }

    } catch (error) {
         handler.handleError(error,dispatch)
        logger.actionFailed('users-updateUserToken')
    }
}

export default {
    updateUserLocale,
    updateUserToken
}
