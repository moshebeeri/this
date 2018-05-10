import {call, put, throttle} from 'redux-saga/effects'
import GroupsApi from "../api/groups";
import ImageApi from "../api/image";
import {setGroup, setGroups, updateGroupListener, updateGroupsListeners} from "../actions/groups";
import * as sagaActions from './sagaActions'
import {handleSucsess} from './SagaSuccsesHandler'
import * as actions from '../reducers/reducerActions'

let groupsApi = new GroupsApi();

function* saveGroupsRequest(action) {
    try {
        let response = yield call(groupsApi.getAll, action.token, 0, 100);
        handleSucsess();
        if (response.length > 0) {
            yield put(setGroups(response));
            yield* updateGroupsListeners(response);
        }
    } catch (error) {
        console.log("failed saveGroupsRequest");
    }
}

function* saveGroup(action) {
    try {
        console.log(action);
        let createdGroup = yield call(groupsApi.createGroup, action.group, action.token);
        handleSucsess();
        createdGroup.touched = new Date().getTime();
        let users = action.group.groupUsers.slice(0);
        let user;
        while (user = users.pop()) {
            yield call(groupsApi.addUserToGroup, user._id, createdGroup._id, action.token);
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
        yield* updateGroupListener(createdGroup);
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

function* updateGroupFollowers(action) {
    try {
        let followers;
        if (action.businessId) {
            followers = yield call(groupsApi.getBusinessFollowers, action.groupId, action.businessId, action.token);
        } else {
            followers = yield call(groupsApi.getUserFollowers, action.groupId,  action.token);
        }
        yield put({
            type: actions.SET_GROUPS_FOLLOWERS,
            followers: followers,
            groupId: action.groupId
        })
    } catch (error) {
        console.log("failed  updateGroupFollowers " + error);
    }
}

function* groupsSaga() {
    yield throttle(2000, sagaActions.SAVE_GROUPS_REQUEST, saveGroupsRequest);
    yield throttle(2000, sagaActions.UPDATE_GROUPS_REQUEST, updateGroup);
    yield throttle(2000, sagaActions.UPDATE_GROUPS_FOLLOWERS, updateGroupFollowers);
    yield throttle(2000, sagaActions.SAVE_GROUP, saveGroup);
}

export default groupsSaga;