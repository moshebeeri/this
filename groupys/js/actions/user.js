/**
 * Created by roilandshut on 27/06/2017.
 */
/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 12/06/2017.
 */
import UserApi from "../api/user"
let userApi = new UserApi();

async function getUser(dispatch){
    try {
        let user = await userApi.getUser();

            dispatch({
                type: 'GET_USER',
                user: user

            });



    }catch (error){
        console.log(error);
    }

}

export function fetchUsers(){
    return function (dispatch, getState){
        dispatch|(getUser(dispatch,));
    }

}