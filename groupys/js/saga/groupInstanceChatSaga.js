import {call, fork, put, race, take, throttle} from 'redux-saga/effects'
import CommentsApi from "../api/commet";
import {
    groupChatDone,
    groupChatMaxLoad,
    groupChatMaxLoadNotReturned,
    updateChatScrollUp,
    updateChatTop
} from "../actions/instanceGroupComments";
import * as sagaActions from './sagaActions'
import {delay} from 'redux-saga'
import {handleSucsess} from './SagaSuccsesHandler'

let commentsApi = new CommentsApi();

function* backgroundTask(group, instance, token, lastChatId) {
    try {
        let id = lastChatId;
        while (true) {
            yield call(delay, 2000);
            if (id !== 0) {
                let response = yield call(commentsApi.getInstanceGroupComments, group, instance, token, id, "up");
                handleSucsess();
                if (response.length > 0) {
                    id = response[response.length - 1]._id;
                    yield* updateChatTop(response, group, instance);
                }
            }
        }
    } catch (error) {
        console.log("failed groups comment request");
    }
}

function* watchStartBackgroundTask() {
    while (true) {
        const {group, instance, token, lastChatId} = yield take(sagaActions.LISTEN_FOR_GROUP_INSTANCE_CHATS);
        yield race({
            task: call(backgroundTask, group, instance, token, lastChatId),
            cancel: take(sagaActions.CANCEL_GROUP_INSTANCE_CHAT_LISTENER)
        })
    }
}

function* chatScrollUp(action) {
    try {
        let response = {};
        if (_.isEmpty(action.comments)) {
            response = yield call(commentsApi.getInstanceGroupComments, action.group, action.instance, action.token, 'start', "down");
            handleSucsess();
            yield put(groupChatDone(action.group, action.instance));
        } else {
            let id = action.comments[0];
            response = yield call(commentsApi.getInstanceGroupComments, action.group, action.instance, action.token, id, "down");
            handleSucsess();
            if (response.length === 0) {
                yield put(groupChatMaxLoad(action.group, action.instance));
            } else {
                yield put(groupChatMaxLoadNotReturned(action.group, action.instance));
            }
        }
        if (response.length > 0) {
            yield* updateChatScrollUp(response, action.group, action.instance);
        }
    } catch (error) {
        console.log("failed scroll down");
    }
}

function* groupsInstanceChatSaga() {
    yield fork(watchStartBackgroundTask);
    yield throttle(1000, sagaActions.GROUP_INSTANCE_CHAT_SCROLL_UP, chatScrollUp);
}

export default groupsInstanceChatSaga;