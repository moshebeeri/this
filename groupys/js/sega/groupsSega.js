import {call, takeLatest, put, take} from 'redux-saga/effects'
import GroupsApi from "../api/groups";
import {setGroups} from "../actions/groups";
import * as segaActions from './segaActions'

let groupsApi = new GroupsApi();

function* saveGroupsRequest(action) {
    try {
        let response = yield call(groupsApi.getAll, action.token,0, 100);
        yield put(setGroups(response))
    } catch (error) {

    }
}

function* groupsSega() {
    yield takeLatest(segaActions.SAVE_GROUPS_REQUEST, saveGroupsRequest);
}



export default groupsSega;