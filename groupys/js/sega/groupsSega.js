import {call, takeLatest, put, throttle} from 'redux-saga/effects'
import GroupsApi from "../api/groups";
import {setGroups} from "../actions/groups";
import * as segaActions from './segaActions'

let groupsApi = new GroupsApi();

function* saveGroupsRequest(action) {
    try {
        let response = yield call(groupsApi.getAll, action.token,0, 100);
        if(response.length > 0) {
            yield put(setGroups(response))
        }
    } catch (error) {
        console.log("failed saveGroupsRequest");
    }
}

function* groupsSega() {
    yield throttle(2000,segaActions.SAVE_GROUPS_REQUEST, saveGroupsRequest);
}



export default groupsSega;