import * as actions from "../reducers/reducerActions";
import UserApi from "../api/user";

let userApi = new UserApi();
import ActionLogger from './ActionLogger'
let logger = new ActionLogger();

export function saveRole(user, businessId, userRole, navigation) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token
            dispatch({
                type: actions.USER_ROLE_SHOW_SPINNER,
                show: false,
            });
            dispatch({
                type: actions.USER_ROLE_SAVING,
            });
            dispatch({
                type: actions.USER_ROLE_SHOW_MESSAGE,
                show: false,
                message: '',
            });
            await userApi.removeUserRole(user._id, businessId);
            await userApi.setUserRole(user._id, businessId, userRole);
            let users = await userApi.getBusinessUsers(businessId, token);
            dispatch({
                type: actions.SET_USER_BUSINESS,
                businessUsers: users,
                businessId: businessId
            });
            dispatch({
                type: actions.USER_ROLE_SAVING_DONE,
            });
            navigation.goBack();
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            logger.actionFailed('userRole-saveRole')
        }
    }
}

export function search(phoneNumber) {
    return async function (dispatch) {
        try {
            dispatch({
                type: actions.USER_ROLE_SHOW_SPINNER,
                show: true,
            });
            dispatch({
                type: actions.USER_ROLE_SHOW_MESSAGE,
                show: false,
                message: '',
            });
            let user = await userApi.getUserByPhone(phoneNumber);
            if (user) {
                dispatch({
                    type: actions.USER_ROLE_SET_USER,
                    user: user._id,
                    fullUser: user
                });
            } else {
                dispatch({
                    type: actions.USER_ROLE_SHOW_MESSAGE,
                    show: true,
                    message: "User not found",
                });
            }
            dispatch({
                type: actions.USER_ROLE_SHOW_SPINNER,
                show: false,
            });
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            logger.actionFailed('userRole-search')
        }
    }
}

export function setRole(role) {
    return function (dispatch) {
        dispatch({
            type: actions.USER_SET_ROLE,
            role: role,
        });
    }
}

export function showSpinner(show) {
    return function (dispatch) {
        dispatch({
            type: actions.USER_ROLE_SHOW_SPINNER,
            show: show,
        });
    }
}

export function showMessage(showMessage, message) {
    return function (dispatch) {
        dispatch({
            type: actions.USER_ROLE_SHOW_MESSAGE,
            show: showMessage,
            message: message,
        });
    }
}

export function clearForm() {
    return function (dispatch) {
        dispatch({
            type: actions.USER_ROLE_CLEAR,
        });
    }
}





