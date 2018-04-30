import {call, throttle,put} from 'redux-saga/effects'
import FeedApi from "../api/feed";
import {
    maxFeedNotReturned,
    maxFeedReturned,
    updateFeeds,
    updateFeedsListeners,
    updateFeedsTop,
    updateFollowers,
    loadingDone
} from "../actions/groups";
import * as sagaActions from './sagaActions'
import {handleSucsess} from './SagaSuccsesHandler'

let feedApi = new FeedApi();

function* setTopFeeds(action) {
    try {
        let response = yield call(feedApi.getAll, 'up', action.lastId, action.token, action.group);
        handleSucsess();
        if (response.length > 0) {
            yield* updateFeedsTop(response, action.group, action.user);
            yield* updateFollowers(response);
        }
    } catch (error) {
        console.log("failed to update social state");
    }
}

function* feedScrollDown(action) {
    try {
        let response = {};
        if (_.isEmpty(action.feeds)) {
            response = yield call(feedApi.getAll, 'down', 'start', action.token, action.group);
            handleSucsess();
        } else {
            let keys = Object.keys(action.feeds);
            let id = action.feeds[keys.length - 1].id;
            response = yield call(feedApi.getAll, 'down', id, action.token,action.group);
            handleSucsess();
            if (response.length === 0) {
                yield put(maxFeedReturned(action.group));
            } else {
                yield put(maxFeedNotReturned(action.group));
            }
        }
        yield put(loadingDone(action.group));
        yield* updateFeeds(response,action.group);
        yield* updateFollowers(response);
        yield* updateFeedsListeners(response);
    } catch (error) {
        console.log("failed scroll down");
    }
}

function* groupFeedSaga() {
    yield throttle(3000, sagaActions.GROUP_FEED_SET_TOP_FEED, setTopFeeds);
    yield throttle(3000, sagaActions.GROUP_FEED_SCROLL_DOWN, feedScrollDown);
}

export default groupFeedSaga;