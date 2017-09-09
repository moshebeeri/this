
import * as actions from '../reducers/reducerActions';

import LoginApi from "../api/login"
let loginApi = new LoginApi();
import UserApi from "../api/user"
let userApi = new UserApi();

import { NavigationActions } from 'react-navigation'
const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'home'})
    ]
});

export function login(phone,password,navigation){
    return async function (dispatch){
        try {
            let response = await loginApi.login(phone, password);
            if(response.token) {

                dispatch({
                    type: actions.SAVE_USER_TOKEN,
                    token:response.token
                });
                dispatch({
                    type: actions.LOGIN_SUCSESS,
                });
                let user = await userApi.getUser(response.token)
                dispatch({
                    type: actions.SET_USER,
                    user:user
                });
                this.props.navigation.dispatch(resetAction);
                this.props.navigation.navigate('home');
            }else{
                dispatch({
                    type: actions.LOGIN_FAILED,
                    message:'bad credentials'
                });
            }
        } catch (error){
            //todo dispatch offline
        }

    }

}
export function signup(phone,password,navigation){
    return async function (dispatch){
        try {
            let response = await loginApi.signup(phone, password);
            if(response.token) {

                dispatch({
                    type: actions.SAVE_USER_TOKEN,
                    token:response.token
                });
                dispatch({
                    type: actions.SIGNUP_SUCSESS,
                });

                let user = await userApi.getUser(response.token)
                dispatch({
                    type: actions.SET_USER,
                    user:user
                });

               navigation.navigate('register');
            }else{
                dispatch({
                    type: actions.SIGNUP_FAILED,
                    message:'invalid phone number'
                });
            }
        } catch (error){
            //todo dispatch offline
        }

    }

}


export function focusLoginForm(focus) {
    return function (dispatch,) {
        if(focus == 'password'){
            dispatch({
                type: actions.LOGIN_FOCUS_PASSWORD,
            });
        }

    }
}

export function focusSignupForm(focus) {
    return function (dispatch,) {
        if(focus == 'phone'){
            dispatch({
                type: actions.SIGNUP_FOCUS_PHONE,
            });
        }
        if(focus == 'password'){
            dispatch({
                type: actions.SIGNUP_FOCUS_PASSWORD,
            });
        }
        if(focus == 'lastName'){
            dispatch({
                type: actions.SIGNUP_FOCUS_LASTNAME,
            });
        }


    }
}

export function verifyCode(code,navigation,resetAction){
    return async function (dispatch,) {
        try{
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
                    message:'invalid validation code'
                });

            }
        }catch(error) {
       //todo dispatch no netwoerk event
         }

    }
}
export function forgetPassword(phoneNumber) {
    return function (dispatch,) {
        if(phoneNumber) {
            loginApi.recoverPassword(phoneNumber)
        }

    }
}






