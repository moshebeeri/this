import {call, put, takeLatest} from 'redux-saga/effects'
import FeedApi from "../api/feed";
import {loadingFeeds, loadingFeedsDone, updateFeeds, updateFeedsTop,scrolling,stopScrolling,renderFeed} from "../actions/feedsMain";
import * as segaActions from './segaActions'

let feedApi = new FeedApi();

function* feedScrollDown(action) {
    try {

        let response = {};
        if (_.isEmpty(action.feeds)) {
            yield put(loadingFeeds());
            response = yield call(feedApi.getAll, 'down', 'start', action.token, action.user);
            yield put(loadingFeedsDone());
        } else {
            yield put(renderFeed());
            yield put(scrolling());
            let keys = Object.keys(action.feeds);
            let id = action.feeds[keys.length - 1].id;
            response = yield call(feedApi.getAll, 'down', id, action.token, action.user);
            yield put(stopScrolling());
        }
        yield* updateFeeds(response);


    } catch (error) {
    }
}

function* feedScrollUp(action) {
    try {

        let response = yield call(feedApi.getAll, 'up', action.id, token, user);
        yield* updateFeedsTop(response);

    } catch (error) {
    }
}

function* feedSega() {
    yield takeLatest(segaActions.FEED_SCROLL_DOWN, feedScrollDown);
    yield takeLatest(segaActions.FEED_SCROLL_UP, feedScrollUp);
}

export default feedSega;