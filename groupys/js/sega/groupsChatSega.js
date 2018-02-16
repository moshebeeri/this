import {call, fork, race, take} from 'redux-saga/effects'
import CommentsApi from "../api/commet";
import {updateChatTop} from "../actions/commentsGroup";
import * as segaActions from './segaActions'
import {delay} from 'redux-saga'

let commentsApi = new CommentsApi();

function* backgroundTask(group, token, lastChatId,user) {
    try {
        let id = lastChatId;
        while (true) {
            yield call(delay, 2000);
            console.log('fetching groups top comments')
            let response = yield call(commentsApi.getGroupComments, group, token, id, "up");
            if (response.length > 0) {
                yield* updateChatTop(response, group,user);
                id = response[response.length -1]._id;
            }
        }
    } catch (error) {
        console.log('failed')
    }
}

function* watchStartBackgroundTask() {
    while (true) {
        const {group, token, lastChatId,user} = yield take(segaActions.LISTEN_FOR_GROUP_CHATS);
        yield race({
            task: call(backgroundTask, group, token, lastChatId,user),
            cancel: take(segaActions.CANCEL_GROUP_CHAT_LISTENER)
        })
    }
}

function* groupsChatSega() {
    yield fork(watchStartBackgroundTask);
}

export default groupsChatSega;