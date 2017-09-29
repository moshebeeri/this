import * as actions from "../reducers/reducerActions";
import LoginApi from "../api/login";
import UserApi from "../api/user";
import {NavigationActions} from "react-navigation";
import store from 'react-native-simple-store';

import ContactApi from '../api/contacts'


let contactApi = new ContactApi();
let loginApi = new LoginApi();
let userApi = new UserApi();
const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName: 'home'})
    ]
});
export function login(phone, password, navigation) {
    return async function (dispatch) {
        try {
            let response = await loginApi.login(phone, password);
            if (response.token) {
                await store.save("token",response.token)
                dispatch({
                    type: actions.SAVE_USER_TOKEN,
                    token: response.token
                });
                dispatch({
                    type: actions.LOGIN_SUCSESS,
                });
                let user = await userApi.getUser(response.token);
                await  store.save("user_id",user._id)
                dispatch({
                    type: actions.SAVE_APP_USER,
                    user: user
                });
                contactApi.syncContacts();
                dispatch({
                    type: actions.SET_USER,
                    user: user
                });
                navigation.dispatch(resetAction);
                navigation.navigate('home');
            } else {
                dispatch({
                    type: actions.LOGIN_FAILED,
                    message: 'bad credentials'
                });
            }
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}
export function signup(phone, password, firstName, lastName, navigation) {
    return async function (dispatch) {
        try {
            let response = await loginApi.signup(phone, password, firstName, lastName);
            if (response.token) {
                await store.save("token",response.token)

                dispatch({
                    type: actions.SAVE_USER_TOKEN,
                    token: response.token
                });
                dispatch({
                    type: actions.SIGNUP_SUCSESS,
                });
                let user = await userApi.getUser(response.token);
                await store.save("user_id",user._id);
                dispatch({
                    type: actions.SET_USER,
                    user: user
                });

                contactApi.syncContacts();
                navigation.navigate('Register');
            } else {
                dispatch({
                    type: actions.SIGNUP_FAILED,
                    message: 'invalid phone number'
                });
            }
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}
export function focusLoginForm(focus) {
    return function (dispatch,) {
        if (focus == 'password') {
            dispatch({
                type: actions.LOGIN_FOCUS_PASSWORD,
            });
        }
    }
}
export function focusSignupForm(focus) {
    return function (dispatch,) {
        if (focus == 'phone') {
            dispatch({
                type: actions.SIGNUP_FOCUS_PHONE,
            });
        }
        if (focus == 'password') {
            dispatch({
                type: actions.SIGNUP_FOCUS_PASSWORD,
            });
        }
        if (focus == 'lastName') {
            dispatch({
                type: actions.SIGNUP_FOCUS_LASTNAME,
            });
        }
    }
}
export function verifyCode(code, navigation, resetAction) {
    return async function (dispatch,) {
        try {
            let response = await loginApi.verifyCode(code);
            if (response.token) {
                dispatch({
                    type: actions.REGISTER_CODE_SUCSSES,
                });
                navigation.dispatch(resetAction);
                navigation.navigate('home');
            } else {
                dispatch({
                    type: actions.REGISTER_CODE_INVALID,
                    message: 'invalid validation code'
                });
            }
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
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
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}
export function changePassword(currentPassword, newPassword, user, token, navigation) {
    return async function (dispatch,) {
        try {
            let response = await loginApi.changePassword(currentPassword, newPassword, user._id, token);
            if (response == true) {
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
        }
    }
}





