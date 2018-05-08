import * as actions from "../reducers/reducerActions";
import * as errors from '../api/Errors';
import LoginApi from "../api/login";
import UserApi from "../api/user";
import {NavigationActions} from "react-navigation";
import store from "react-native-simple-store";
import ActionLogger from './ActionLogger'
import handler from './ErrorHandler'
import strings from "../i18n/i18n"
import FormUtils from '../utils/fromUtils';

let loginApi = new LoginApi();
let userApi = new UserApi();
let logger = new ActionLogger();
const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName: 'home'})
    ]
});

export function login(phone, password, navigation, callingCode) {
    return async function (dispatch) {
        try {
            dispatch({
                type: actions.LOGIN_PROCESS,
                value: true
            });
            let response = await loginApi.login(phone, password, callingCode);
            if (response.token) {
                await store.save("token", response.token)
                dispatch({
                    type: actions.SAVE_USER_TOKEN,
                    token: response.token
                });
                dispatch({
                    type: actions.LOGIN_SUCSESS,
                });
                let user = await userApi.getUser(response.token);
                user.locale = FormUtils.getLocale();
                userApi.saveUserDetails(user, null, response.token, null);
                dispatch({
                    type: actions.SET_USER,
                    user: user
                });
                await  store.save("user_id", user._id)
                if (!user.sms_verified) {
                    navigation.navigate('Register');
                } else {
                    dispatch({
                        type: actions.SAVE_APP_USER,
                        user: user
                    });
                    navigation.dispatch(resetAction);
                }
            } else {
                dispatch({
                    type: actions.LOGIN_FAILED,
                    message: strings.LoginFailedMessage
                });
            }
            dispatch({
                type: actions.LOGIN_PROCESS,
                value: false
            });
        } catch (error) {
            if (error === errors.NETWORK_ERROR) {
                dispatch({
                    type: actions.LOGIN_FAILED,
                    message: strings.networkErrorMessage
                });
            } else {
                dispatch({
                    type: actions.LOGIN_FAILED,
                    message: strings.LoginFailedMessage
                });
            }
            dispatch({
                type: actions.LOGIN_PROCESS,
                value: false
            });
            handler.handleError(error, dispatch, 'login')
            logger.actionFailed('login')
        }
    }
}

export function signup(phone, password, firstName, lastName, navigation, callingCode) {
    return async function (dispatch) {
        try {
            dispatch({
                type: actions.SIGNUP_PROCESS,
                value: true
            });
            let response = await loginApi.signup(phone, password, firstName, lastName, callingCode);
            if (response === 'user already exist') {
                dispatch({
                    type: actions.SIGNUP_PROCESS,
                    value: false
                });
                dispatch({
                    type: actions.SIGNUP_FAILED,
                    message: strings.SignUpUserExist
                });
                return;
            }
            await store.save("token", response.token)
            dispatch({
                type: actions.SAVE_USER_TOKEN,
                token: response.token
            });
            dispatch({
                type: actions.SIGNUP_SUCSESS,
            });
            navigation.navigate('Register');
            dispatch({
                type: actions.SIGNUP_PROCESS,
                value: false
            });
        }
        catch (error) {
            if (error === errors.SIGNUP_FAILED) {
                dispatch({
                    type: actions.SIGNUP_FAILED,
                    message: strings.invalidPhoneNumber
                });
            } else {
                if (error === errors.NETWORK_ERROR) {
                    dispatch({
                        type: actions.SIGNUP_FAILED,
                        message: strings.networkErrorMessage
                    });
                }
                handler.handleError(error, dispatch, 'signup')
            }
            dispatch({
                type: actions.SIGNUP_PROCESS,
                value: false
            });
            logger.actionFailed('signup')
        }
    }
}

export function focusLoginForm(focus) {
    return function (dispatch,) {
        if (focus === 'password') {
            dispatch({
                type: actions.LOGIN_FOCUS_PASSWORD,
            });
        }
    }
}

export function focusSignupForm(focus) {
    return function (dispatch,) {
        if (focus === 'phone') {
            dispatch({
                type: actions.SIGNUP_FOCUS_PHONE,
            });
        }
        if (focus === 'password') {
            dispatch({
                type: actions.SIGNUP_FOCUS_PASSWORD,
            });
        }
        if (focus === 'lastName') {
            dispatch({
                type: actions.SIGNUP_FOCUS_LASTNAME,
            });
        }
    }
}

export function verifyCode(code, navigation, resetAction) {
    return async function (dispatch, getState) {
        try {
            dispatch({
                type: actions.REGISTER_PROCESS,
                value: true
            });
            const token = getState().authentication.token;
            await loginApi.verifyCode(code, token);
            let user = await userApi.getUser(token);
            await store.save("user_id", user._id);
            user.locale = FormUtils.getLocale();
            userApi.saveUserDetails(user, null, token, null);
            dispatch({
                type: actions.SET_USER,
                user: user
            });
            dispatch({
                type: actions.REGISTER_CODE_SUCSSES,
            });
            dispatch({
                type: actions.REGISTER_PROCESS,
                value: false
            });
            navigation.dispatch(resetAction);
        } catch (error) {
            console.log(error);
            if (error === errors.UNHANDLED_ERROR) {
                dispatch({
                    type: actions.REGISTER_CODE_INVALID,
                    message: strings.InvalidValidationCode
                });
            } else {
                if (error === errors.UN_AUTHOTIZED_ACCESS) {
                    dispatch({
                        type: actions.REGISTER_CODE_INVALID,
                        message: strings.InvalidValidationCode
                    });
                } else {
                    handler.handleError(error, dispatch, 'verifyCode')
                }
            }
            dispatch({
                type: actions.REGISTER_PROCESS,
                value: false
            });
        }
    }
}

export function forgetPassword(phoneNumber) {
    return function (dispatch,) {
        try {
            if (phoneNumber) {
                loginApi.recoverPassword(phoneNumber)
            }
        } catch (error) {
            handler.handleError(error, dispatch, 'forgetPassword')
            logger.actionFailed('forgetPassword')
        }
    }
}

export function changePassword(currentPassword, newPassword, user, token, navigation) {
    return async function (dispatch,) {
        try {
            let response = await loginApi.changePassword(currentPassword, newPassword, user._id, token);
            if (response) {
                navigation.goBack();
            } else {
                dispatch({
                    type: actions.CHANGE_PASSWORD_FAILED,
                    message: 'Change password failed'
                });
            }
        } catch (response) {
            dispatch({
                type: actions.CHANGE_PASSWORD_FAILED,
                message: 'Failed to Authenticate Current Password'
            });
            logger.actionFailed('changePassword')
        }
    }
}





