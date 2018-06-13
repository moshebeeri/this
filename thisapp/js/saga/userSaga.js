import {call, fork, put, take, throttle} from 'redux-saga/effects'
import UserApi from "../api/user";
import ImageApi from "../api/image";
import {upSertUserSuccsess} from "../actions/user";
import * as sagaActions from './sagaActions'
import {handleSucsess} from './SagaSuccsesHandler'
import * as actions from '../reducers/reducerActions';

let userApi = new UserApi();

function* saveUserRequest() {
    let {newUser, token, user} = yield take(sagaActions.SAVE_USER_REQUEST);
    try {
        let colonedUser = JSON.parse(JSON.stringify(user));
        colonedUser.name = newUser.name;
        yield call(userApi.saveUserDetails, newUser, newUser._id, token);
        handleSucsess();
        if (newUser.image) {
            let pictures = [];
            if (newUser.image.path) {
                pictures.push(newUser.image.path);
                pictures.push(newUser.image.path);
                pictures.push(newUser.image.path);
                pictures.push(newUser.image.path);
                colonedUser.pictures.push({pictures: pictures});
            }
            yield* upSertUserSuccsess(colonedUser)
            let userResponse = yield call(ImageApi.uploadImage, token, newUser.image, newUser._id);
            yield* upSertUserSuccsess(userResponse)
        } else {
            yield* upSertUserSuccsess(colonedUser)
        }
    }
    catch
        (error) {
    }
}

function* getUserEntityRoles(action) {
    try {
        let response = yield call(userApi.getUserEntityRoles, action.token, action.entityId);
        handleSucsess();
        if (response.length > 0) {
            yield put({
                type: actions.SET_USER_ENTITY_ROLES,
                entityId: action.entityId,
                roles: response
            });
        } else {
            yield put({
                type: actions.SET_USER_ENTITY_ROLES,
                entityId: action.entityId,
                roles: []
            });
        }
    } catch (error) {
        console.log("failed groups comment request");
    }
}

function* userSaga() {
    yield fork(saveUserRequest);
    yield throttle(2000, sagaActions.GET_USER_ENTITY_ROLES, getUserEntityRoles);
}

export default userSaga;