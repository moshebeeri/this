import {call, fork, take} from 'redux-saga/effects'
import UserApi from "../api/user";
import ImageApi from "../api/image";
import {upSertUserSuccsess} from "../actions/user";
import * as segaActions from './segaActions'
import {handleSucsess}from './SegaSuccsesHandler'

let userApi = new UserApi();

function* saveUserRequest() {
    let {newUser, token,} = yield take(segaActions.SAVE_USER_REQUEST);
    try {
        //remove file images
        newUser.pictures == {};
        yield call(userApi.saveUserDetails, newUser, newUser._id, token);
        handleSucsess();
        if (newUser.image) {
            yield call(ImageApi.uploadImage,token, newUser.image, newUser._id);
        }
        let pictures = []
        if (newUser.image.path) {
            pictures.push(newUser.image.path);
            pictures.push(newUser.image.path);
            pictures.push(newUser.image.path);
            pictures.push(newUser.image.path);
            newUser.pictures.push({pictures: pictures});
        }
        yield* upSertUserSuccsess(newUser)


    }
    catch
        (error) {
    }
}

function* userSega() {
    yield fork(saveUserRequest);
}

export default userSega;