import {call, put, throttle} from 'redux-saga/effects'
import CommentsApi from "../api/commet";
import {
    feedChatDone,
    feedChatMaxLoad,
    feedChatMaxLoaddNotReturned,
    updateChatScrollUp,
    updateChatTop,
} from "../actions/commentsEntities";
import {handleSucsess} from './SegaSuccsesHandler'
import * as segaActions from './segaActions'

let commentsApi = new CommentsApi();

function* syncFeedComment(action) {
    try {
        let response = yield call(commentsApi.getFeedComments, action.entities, action.token, action.lastChatId, "up");
        handleSucsess();
        if (response.length > 0) {
            yield* updateChatTop(response, action.generalId);
        }
    } catch (error) {
        console.log("failed groups comment request");
    }
}

function* chatScrollUp(action) {
    try {
        let response = {};
        if (_.isEmpty(action.comments)) {
            response = yield call(commentsApi.getFeedComments, action.entities, action.token, 'start', "down");
            handleSucsess();
            yield put(feedChatDone(action.generalId));
        } else {
            let id = action.comments[action.comments.length - 1];
            response = yield call(commentsApi.getFeedComments, action.entities, action.token, id, "down");
            handleSucsess();
            yield put(feedChatDone(action.generalId));
            if (response.length === 0) {
                yield put(feedChatMaxLoad(action.generalId));
            } else {
                yield put(feedChatMaxLoaddNotReturned(action.generalId));
            }
        }
        if (response.length > 0) {
            yield* updateChatScrollUp(response, action.generalId);
        }
    } catch (error) {
        console.log("failed scroll down");
    }
}

function* feedChatSega() {
    yield throttle(1000, segaActions.FEED_CHAT_SCROLL_UP, chatScrollUp);
    yield throttle(1000, segaActions.FEED_SYNC_CHAT, syncFeedComment);
}

export default feedChatSega;