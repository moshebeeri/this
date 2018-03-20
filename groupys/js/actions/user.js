import UserApi from "../api/user";
import LoginAPI from "../api/login";
import * as actions from "../reducers/reducerActions";
import * as errors from "../api/Errors";
import simpleStore from 'react-native-simple-store';
import ActionLogger from './ActionLogger'
import strings from "../i18n/i18n"
import {put} from 'redux-saga/effects'
import * as types from '../sega/segaActions';
import handler from './ErrorHandler'

let userApi = new UserApi();
let loginApi = new LoginAPI();
let logger = new ActionLogger();

async function getUser(dispatch, token) {
    try {
        let user = await UserApi.getUser(token);
        dispatch({
            type: actions.UPSERT_SINGLE_USER,
            item: user
        })
        simpleStore.save('user', user);
        dispatch({
            type: actions.SET_USER,
            user: user
        })
    } catch (error) {
        handler.handleError(error, dispatch, 'getUser')
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
        handler.handleError(error, dispatch, 'getUserFollowers')
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
            if (response) {
                navigation.goBack();
            }
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            if (error === errors.UN_AUTHOTIZED_ACCESS) {
                dispatch({
                    type: actions.CHANGE_PASSWORD_FAILED,
                    message: strings.OldPasswordValidationFailed
                });
            } else {
                handler.handleError(error, dispatch, 'changePassword')
            }
            dispatch({
                type: actions.SAVING_USER_DONE,
            });
            logger.actionFailed('users-changePassword')
        }
    }
}

export function updateUser(newUser) {
    return function (dispatch, getState) {
        const token = getState().authentication.token
        if (newUser) {
            dispatch({
                type: types.SAVE_USER_REQUEST,
                newUser: newUser,
                token: token,
            })
        }
    }
}

export function* upSertUserSuccsess(newUser) {
    yield put({
        type: actions.SET_USER,
        user: newUser
    });
}




export function resetForm() {
    return function (dispatch) {
        dispatch({
            type: actions.SAVING_USER_DONE,
        });

    }
}

export function resetPasswordForm() {
    return function (dispatch) {
        dispatch({
            type: actions.CHANGE_PASSWORD_CLEAR
        });
    }
}

async function updateUserLocale(dispatch, token, user, locale) {
    try {
        if (!user.locale || (user.locale && user.locale !== locale)) {
            dispatch({
                type: actions.SAVING_USER,
            });
            user.locale = locale;
            await userApi.saveUserDetails(user, user._id, token, dispatch);
            let updatedUser = await UserApi.getUser(token);
            simpleStore.save('user', updatedUser);
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
        handler.handleError(error, dispatch, 'updateUserLocale')
        logger.actionFailed('users-updateUserLocale')
    }
}

async function updateUserToken(dispatch, token, user, fireBaseToken) {
    try {
        // if(!(user.firebase && user.firebase.tokens && user.firebase.tokens[0] === fireBaseToken)){
        //     //not update token
        // }
        console.log(`${user.firebase.tokens[0]} !== ${fireBaseToken}`);
        if (/*!user.firebase || (user.firebase && !user.firebase.tokens ) || (
                user.firebase && user.firebase.tokens && user.firebase.tokens[0] !== fireBaseToken)*/
            true
        ) {
            dispatch({
                type: actions.SAVING_USER,
            });
            user.firebase = {tokens: [fireBaseToken]};
            await userApi.saveUserDetails(user, user._id, token, dispatch);
            let updatedUser = await UserApi.getUser(token);
            simpleStore.save('user', updatedUser);
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
        handler.handleError(error, dispatch, 'updateUserToken')
        logger.actionFailed('users-updateUserToken')
    }
}

async function updateUserTask(dispatch, token, newUser) {
    try {
        dispatch({
            type: actions.SAVING_USER,
        });
        console.log('updating user')
        userApi.saveUserDetails(newUser, user._id, token, dispatch);
        let updatedUser = await UserApi.getUser(token);
        simpleStore.save('user', updatedUser);
        dispatch({
            type: actions.UPSERT_SINGLE_USER,
            item: newUser
        });
        dispatch({
            type: actions.SET_USER,
            user: newUser
        });
        if (navigation) {
            navigation.goBack();
        }
        dispatch({
            type: actions.SAVING_USER_DONE,
        });
        handler.handleSuccses(getState(), dispatch)
    } catch (error) {
        handler.handleError(error, dispatch, 'updateUser')
        logger.actionFailed('users-updateUser')
    }
}

export function testError() {
    return function (dispatch, getState) {
        try {
            userApi.testError();
        } catch (error) {
            handler.handleError(error, dispatch, 'updateUser')
            logger.actionFailed('users-updateUser')
        }
    }
}

export default {
    updateUserLocale,
    updateUserToken,
    updateUserTask
}
