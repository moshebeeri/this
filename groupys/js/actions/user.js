
import UserApi from "../api/user"
let userApi = new UserApi();

async function getUser(dispatch,token){
    try {
        let user = await userApi.getUser(token);

            dispatch({
                type: 'GET_USER',
                user: user

            });



    }catch (error){
        console.log(error);
    }

}


async function getUserFollowers(dispatch,token){
    try {
        let users = await userApi.getUserFollowers(token);

        dispatch({
            type: 'GET_USER_FOLLOWERS',
            followers: users

        });



    }catch (error){
        console.log(error);
    }

}

async function getBusinssUsers(dispatch,business,token){
    try {
        let users = await userApi.getBusinessUsers(business,token);

        dispatch({
            type: 'GET_USER_BUSINESS',
            businessUsers: users,
            businessId:business

        });



    }catch (error){
        console.log(error);
    }

}

export function fetchUsers(){
    return function (dispatch, getState){
        const token = getState().authentication.token

        dispatch|(getUser(dispatch,token));
    }

}

export function fetchUsersFollowers(){
    return function (dispatch, getState){
        const token = getState().authentication.token

        dispatch|(getUserFollowers(dispatch,token));
    }

}

export function fetchUsersBusiness(business){
    return function (dispatch, getState){
        const token = getState().authentication.token
        dispatch|(getBusinssUsers(dispatch,business,token));
    }

}