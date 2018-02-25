import {call, fork, put, take} from 'redux-saga/effects'
import UserApi from "../api/user";
import ImageApi from "../api/image";
import {upSertUserSuccsess} from "../actions/user";
import * as segaActions from './segaActions'

let userApi = new UserApi();

function* saveUserRequest() {
    const {newUser, token,} = yield take(segaActions.SAVE_USER_REQUEST);
    try {
        yield call(userApi.saveUserDetails, newUser, newUser._id, token);
        if(newUser.image){
            ImageApi.uploadImage(token,newUser.image,newUser._id);
        }


        yield* upSertUserSuccsess(newUser)
    } catch (error) {

    }
}

function* userSega() {
    yield fork(saveUserRequest);
}

export default userSega;