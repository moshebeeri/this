import {call, put, race, take, throttle} from 'redux-saga/effects'
import FeedApi from "../api/feed";
import PromotionApi from "../api/promotion";
import {delay} from 'redux-saga'
import {
    loadingFeeds,
    loadingFeedsDone,
    maxFeedNotReturned,
    maxFeedReturned,
    scrolling,
    setSavedInstance,
    stopScrolling,
    updateFeeds,
    updateFeedsTop,
    updateSocialState,
    updateFollowers
} from "../actions/feedsMain";
import {handleSucsess} from './SagaSuccsesHandler'
import * as sagaActions from './sagaActions'

let feedApi = new FeedApi();
let promotionApi = new PromotionApi();

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
        yield* updateFollowers(response);

    } catch (error) {
        console.log("failed scroll down");
    }
}


function* setTopFeeds(action) {
    try {
        let response = yield call(feedApi.getAll, 'up', action.lastId, action.token, action.user);
        handleSucsess();
        if (response.length > 0) {
            yield* updateFeedsTop(response);
            yield* updateFollowers(response);
        }
    } catch (error) {
        console.log("failed to update social state");
    }
}

function* setSocialState(action) {
    try {
        const response = yield call(feedApi.getFeedSocialState, action.id, action.token);
        handleSucsess();
        yield put(updateSocialState(response, action.id));
    } catch (error) {
        console.log("failed to update social state");
    }
}

function* feedUpdate(action) {
    try {
        const response = yield call(feedApi.get, action.item.fid, action.token);
        let listFeeds = [];
        listFeeds.push(response);
        handleSucsess();
        yield* updateFeeds(listFeeds);
    } catch (error) {
        console.log("failed to update feed");
    }
}

function* savedInstanceUpdate(action) {
    try {
        const response = yield call(promotionApi.getPromotionSavedInstance, action.item.id, action.token);
        yield put(setSavedInstance(response));
    } catch (error) {
        console.log("failed to update saved feed");
    }
}

function* feedSaga() {
    yield throttle(1000, sagaActions.FEED_SCROLL_DOWN, feedScrollDown);
    yield throttle(1000, sagaActions.FEED_UPDATE_ITEM, feedUpdate);
    yield throttle(1000, sagaActions.FEED_UPDATE_SAVED_ITEM, savedInstanceUpdate);
    yield throttle(3000, sagaActions.FEED_SET_SOCIAL_STATE, setSocialState);
    yield throttle(3000, sagaActions.FEED_SET_TOP_FEED, setTopFeeds);
    //   yield fork(watchStartBackgroundTask);
}

export default feedSaga;