import {call, fork, race, take,throttle} from 'redux-saga/effects'
import FeedApi from "../api/feed";
import {delay} from 'redux-saga'
import {updateFeedsTop,} from "../actions/groups";
import * as sagaActions from './sagaActions'
import {handleSucsess}from './SagaSuccsesHandler'
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

function* groupFeedSaga() {
    yield throttle(3000, sagaActions.GROUP_FEED_SET_TOP_FEED, setTopFeeds);
}

export default groupFeedSaga;