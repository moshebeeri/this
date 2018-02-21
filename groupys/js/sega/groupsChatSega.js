import {call, fork, race, take,throttle,put} from 'redux-saga/effects'
import CommentsApi from "../api/commet";
import {groupChatDone, groupChatMaxLoad, updateChatScrollUp, updateChatTop,groupChatMaxLoaddNotReturned} from "../actions/commentsGroup";
import * as segaActions from './segaActions'
import {delay} from 'redux-saga'

let commentsApi = new CommentsApi();

function* backgroundTask(group, token, lastChatId, user) {
    try {
        let id = lastChatId;
        while (true) {
            yield call(delay, 2000);
            console.log('fetching groups top comments')
            let response = yield call(commentsApi.getGroupComments, group, token, id, "up");
            if (response.length > 0) {
                yield* updateChatTop(response, group, user);
                id = response[response.length - 1]._id;
            }
        }
    } catch (error) {
        console.log("failed groups comment request");
    }
}

function* watchStartBackgroundTask() {
    while (true) {
        const {group, token, lastChatId, user} = yield take(segaActions.LISTEN_FOR_GROUP_CHATS);
        yield race({
            task: call(backgroundTask, group, token, lastChatId, user),
            cancel: take(segaActions.CANCEL_GROUP_CHAT_LISTENER)
        })
    }
}

function* chatScrollUp(action) {
    try {
        let response = {};
        if (_.isEmpty(action.comments)) {
            response = yield call(commentsApi.getGroupComments, action.group, action.token, 'start', "down");
            yield put(groupChatDone(action.group));
        } else {

            let id = action.comments[0];
            response = yield call(commentsApi.getGroupComments, action.group, action.token, id, "down");
            if (response.length === 0) {
                yield put(groupChatMaxLoad(action.group));
            } else {
                yield put(groupChatMaxLoaddNotReturned(action.group));
            }
        }
        if(response.length > 0) {
            yield* updateChatScrollUp(response, action.group,);
        }
    } catch (error) {
        console.log("failed scroll down");
    }
}

function* groupsChatSega() {
    yield fork(watchStartBackgroundTask);
    yield throttle(1000, segaActions.GROUP_CHAT_SCROLL_UP, chatScrollUp);
}

export default groupsChatSega;