import UserApi from "../api/user";
import LoginAPI from "../api/login";
import * as actions from "../reducers/reducerActions";
let userApi = new UserApi();
let loginApi = new LoginAPI();
async function getUser(dispatch, token) {
    try {
        let user = await userApi.getUser(token);
        dispatch({
            type: actions.UPSERT_SINGLE_USER,
            item: user
        })
        dispatch({
            type: actions.SET_USER,
            user: user
        })
    } catch (error) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
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
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
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

export function changePassword(oldPassword,newPassword,navigation){
    return async function (dispatch, getState) {
        const token = getState().authentication.token
        const user =  getState().user.user

        try {
            let response = await loginApi.changePassword(oldPassword, newPassword, user._id, token)
            if (response.response === true) {
                navigation.goBack();
            }else{
                dispatch({
                    type: actions.CHANGE_PASSWORD_FAILED,
                    message:response.error
                });
            }
        }catch (error){
            dispatch({
                type: actions.CHANGE_PASSWORD_FAILED,
                message:'Failed to change password'
            });
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }

    }
}

export function resetPasswordForm(){
    return function (dispatch) {
        dispatch({
            type: actions.CHANGE_PASSWORD_CLEAR
        });


    }
}