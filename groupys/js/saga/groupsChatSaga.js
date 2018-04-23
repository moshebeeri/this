import {call, put, throttle} from 'redux-saga/effects'
import CommentsApi from "../api/commet";
import {
    groupChatDone,
    groupChatMaxLoad,
    groupChatMaxLoaddNotReturned,
    updateChatScrollUp,
    updateChatTop
} from "../actions/commentsGroup";
import * as sagaActions from './sagaActions'
import {handleSucsess} from './SagaSuccsesHandler'

let commentsApi = new CommentsApi();

function* syncGroupComment(action) {
    try {
        let response = yield call(commentsApi.getGroupComments, {_id: action.group}, action.token, action.lastChatId, "up");
        handleSucsess();
        if (response.length > 0) {
            yield* updateChatTop(response, {_id: action.group}, action.user);
        }
    } catch (error) {
        console.log("failed groups comment request");
    }
}

function* chatScrollUp(action) {
    try {
        let response = {};
        if (_.isEmpty(action.comments)) {
            response = yield call(commentsApi.getGroupComments, action.group, action.token, 'start', "down");
            handleSucsess();
            yield put(groupChatDone(action.group));
        } else {
            let id = action.comments[0];
            response = yield call(commentsApi.getGroupComments, action.group, action.token, id, "down");
            handleSucsess();
            if (response.length === 0) {
                yield put(groupChatMaxLoad(action.group));
            } else {
                yield put(groupChatMaxLoaddNotReturned(action.group));
            }
        }
        if (response.length > 0) {
            yield* updateChatScrollUp(response, action.group,);
        }
    } catch (error) {
        console.log("failed scroll down");
    }
}

function* groupsChatSaga() {
    yield throttle(1000, sagaActions.GROUP_CHAT_SCROLL_UP, chatScrollUp);
    yield throttle(1000, sagaActions.GROUP_SYNC_CHAT, syncGroupComment);
}

export default groupsChatSaga;