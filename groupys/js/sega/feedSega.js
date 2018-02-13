import {call, put, takeLatest} from 'redux-saga/effects'
import FeedApi from "../api/feed";
import {loadingFeeds, loadingFeedsDone, updateFeeds2} from "../actions/feedsMain";
import * as segaActions from './segaActions'

let feedApi = new FeedApi();

function* feedScrollDown(action) {
    try {
        yield put(loadingFeeds());
        let response = {};
        if (_.isEmpty(action.feeds)) {
            response = yield call(feedApi.getAll, 'down', 'start', action.token, action.user);
        } else {
            let keys = Object.keys(action.feeds);
            let id = keys[keys.length - 1];
            response = yield call(feedApi.getAll, 'down', action.feeds[id].fid, token, user);
        }

        console.log(response);
        yield* updateFeeds2(response);


        yield put(loadingFeedsDone());
    } catch (error) {

    }
}

function* feedSega() {
    yield takeLatest(segaActions.FEED_SCROL_DOWN, feedScrollDown);
}

export default feedSega;