
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
                    type: actions.LOGIN_FAILED,
                    message:'bad credentials'
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


export function focus(focus) {
    return function (dispatch,) {
        if(focus == 'password'){
            dispatch({
                type: actions.LOGIN_FOCUS_PASSWORD,
            });
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





