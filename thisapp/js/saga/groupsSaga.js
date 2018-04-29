import {call, takeLatest, put, throttle} from 'redux-saga/effects'
import GroupsApi from "../api/groups";
import ImageApi from "../api/image";
import {setGroups,setGroup} from "../actions/groups";
import * as sagaActions from './sagaActions'
import {handleSucsess}from './SagaSuccsesHandler'
let groupsApi = new GroupsApi();

function* saveGroupsRequest(action) {
    try {
        let response = yield call(groupsApi.getAll, action.token,0, 100);
        handleSucsess();
        if(response.length > 0) {
            yield put(setGroups(response,action.state,action.dispatch))
        }
    } catch (error) {
        console.log("failed saveGroupsRequest");
    }
}

function* saveGroup(action) {
    try {
        console.log(action);
        let createdGroup = yield call(groupsApi.createGroup, action.group, action.token);
        yield call(groupsApi.touch, createdGroup._id, action.token);
        handleSucsess();
        createdGroup.touched = new Date().getTime();
        let users = action.group.groupUsers.slice(0);
        let user;
        while (user = users.pop()) {
            yield call(groupsApi.addUserToGroup,user._id, createdGroup._id, action.token);
        }
        createdGroup.social_state = {};
        createdGroup.social_state.followers = action.group.groupUsers.length + 1;
        createdGroup.pictures = [];
        let pictures = [];
        if (action.group.image.path) {
            pictures.push(action.group.image.path);
            pictures.push(action.group.image.path);
            pictures.push(action.group.image.path);
            pictures.push(action.group.image.path);
            createdGroup.pictures.push({pictures: pictures});
        } else {
            pictures.push(action.group.image.uri);
            pictures.push(action.group.image.uri);
            pictures.push(action.group.image.uri);
            pictures.push(action.group.image.uri);
            createdGroup.pictures.push({pictures: pictures});
        }
        yield put(setGroup(createdGroup));
        if (action.group.image) {
            let response = yield call(ImageApi.uploadImage, action.token, action.group.image, createdGroup._id);
            response.touched = new Date().getTime();
            yield put(setGroup(response));
        }
    } catch (error) {
        console.log("failed  updateProductn");
    }
}


function* updateGroup(action) {
    try {
        let createdGroup = yield call(groupsApi.updateGroup, action.group, action.token);
        yield call(groupsApi.touch, createdGroup._id, action.token);
        handleSucsess();
        createdGroup.touched = new Date().getTime();
        let pictures = [];
        if (action.group.image.path) {
            pictures.push(action.group.image.path);
            pictures.push(action.group.image.path);
            pictures.push(action.group.image.path);
            pictures.push(action.group.image.path);
            createdGroup.pictures.push({pictures: pictures});
        }
        yield put(setGroup(createdGroup));
        if (action.group.image) {
            let response = yield call(ImageApi.uploadImage, action.token, action.group.image, createdGroup._id);
            response.touched = new Date().getTime();
            yield put(setGroup(response));
        }
    } catch (error) {
        console.log("failed  updateProductn");
    }
}

function* groupsSaga() {
    yield throttle(2000, sagaActions.SAVE_GROUPS_REQUEST, saveGroupsRequest);
    yield throttle(2000, sagaActions.UPDATE_GROUPS_REQUEST, updateGroup);
    yield throttle(2000, sagaActions.SAVE_GROUP, saveGroup);
}



export default groupsSaga;