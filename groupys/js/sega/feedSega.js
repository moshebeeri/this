import {call, fork, put, race, take, throttle} from 'redux-saga/effects'
import FeedApi from "../api/feed";
import {delay} from 'redux-saga'
import {
    loadingFeeds,
    loadingFeedsDone,
    maxFeedNotReturned,
    maxFeedReturned,
    scrolling,
    stopScrolling,
    updateFeeds,
    updateFeedsTop,
    updateSocialState
} from "../actions/feedsMain";
import {handleSucsess}from './SegaSuccsesHandler'
import * as segaActions from './segaActions'
import feedComperator from "../reduxComperators/MainFeedComperator"

let feedApi = new FeedApi();

function* feedScrollDown(action) {
    try {
        let response = {};
        if (_.isEmpty(action.feeds)) {
            yield put(loadingFeeds());
            response = yield call(feedApi.getAll, 'down', 'start', action.token, action.user);
            handleSucsess();
            yield put(loadingFeedsDone());
        } else {
            yield put(scrolling());
            let keys = Object.keys(action.feeds);
            let id = action.feeds[keys.length - 1].id;
            response = yield call(feedApi.getAll, 'down', id, action.token, action.user);
            handleSucsess();
            if (response.length === 0) {
                yield put(maxFeedReturned());
            } else {
                yield put(maxFeedNotReturned());
            }
            yield put(stopScrolling());
        }
        yield* updateFeeds(response);
    } catch (error) {
        console.log("failed scroll down");
    }
}

function* backgroundTask(token, lastId, user) {
    try {
        let id = lastId;
        let delayTime = 1000;
        while (true) {
            if (delayTime > 60000) {
                delayTime = 60000;
            }
            yield call(delay, delayTime);
            console.log('calling feeds fetch ' + lastId);
            let response = yield call(feedApi.getAll, 'up', id, token, user);
            handleSucsess();
            if (response.length > 0) {
                yield* updateFeedsTop(response);
                id = response[response.length - 1]._id;
            }
            delayTime = delayTime * 1.5
        }
    } catch (error) {
        console.log("failed groups comment request");
    }
}

function* watchStartBackgroundTask() {
    while (true) {
        const {token, user, id} = yield take(segaActions.LISTEN_FOR_MAIN_FEED);
        yield race({
            task: call(backgroundTask, token, id, user),
            cancel: take(segaActions.CANCEL_MAIN_FEED_LISTENER)
        })
    }
}

function* setSocialState(action) {
    try {
        const response = yield call(feedApi.getFeedSocialState, action.id, action.token);
        handleSucsess();
        if (feedComperator.shouldUpdateSocial(action.feed, response)) {
            yield put(updateSocialState(response, action.id));
        }
    } catch (error) {
        console.log("failed to update social state");
    }
}

function* feedSega() {
    yield throttle(1000, segaActions.FEED_SCROLL_DOWN, feedScrollDown);
    yield throttle(3000, segaActions.FEED_SET_SOCIAL_STATE, setSocialState);
    yield fork(watchStartBackgroundTask);
}

export default feedSega;