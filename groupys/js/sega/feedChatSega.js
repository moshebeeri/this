import {call, fork, put, race, take, throttle} from 'redux-saga/effects'
import CommentsApi from "../api/commet";
import {
    feedChatDone,
    feedChatMaxLoad,
    feedChatMaxLoaddNotReturned,
    updateChatScrollUp,
    updateChatTop,
    restartListenForChat
} from "../actions/commentsEntities";
import * as segaActions from './segaActions'
import {delay} from 'redux-saga'

let commentsApi = new CommentsApi();

function* backgroundTask(entities, token, lastChatId, generalId) {
    try {
        let id = lastChatId;
        while (true) {
            yield call(delay, 2000);
            if(id !== 0){
                let response = yield call(commentsApi.getFeedComments, entities, token, id, "up");
                if (response.length > 0) {
                    yield* updateChatTop(response, generalId);
                    id = response[response.length - 1]._id;
                }
            }

        }
    } catch (error) {
        console.log("failed feed comment request");
    }
}

function* watchStartBackgroundTask() {
    while (true) {
        const {entities, token, lastChatId, generalId} = yield take(segaActions.LISTEN_FOR_FEED_CHATS);
        yield race({
            task: call(backgroundTask, entities, token, lastChatId, generalId),
            cancel: take(segaActions.CANCEL_FEED_CHAT_LISTENER)
        })
    }
}

function* chatScrollUp(action) {
    try {
        let response = {};
        if (_.isEmpty(action.comments)) {
            response = yield call(commentsApi.getFeedComments, action.entities, action.token, 'start', "down");
            yield put(feedChatDone(action.generalId));
        } else {
            let id = action.comments[action.comments.length -1];
            response = yield call(commentsApi.getFeedComments, action.entities, action.token, id, "down");
            if (response.length === 0) {
                yield put(feedChatMaxLoad(action.generalId));
            } else {
                yield put(feedChatMaxLoaddNotReturned(action.generalId));
            }
        }
        if (response.length > 0) {
            const chatFeeds = response.slice(0);
            yield* updateChatScrollUp(response, action.generalId);
            if(_.isEmpty(action.comments)){
                yield* restartListenForChat(action.entities,action.generalId,chatFeeds,action.token)
            }
        }
    } catch (error) {
        console.log("failed scroll down");
    }
}

function* feedChatSega() {
    yield fork(watchStartBackgroundTask);
    yield throttle(1000, segaActions.FEED_CHAT_SCROLL_UP, chatScrollUp);
}

export default feedChatSega;