import {call, fork, race, take} from 'redux-saga/effects'
import FeedApi from "../api/feed";
import {delay} from 'redux-saga'
import {updateFeedsTop,} from "../actions/groups";
import * as segaActions from './segaActions'
import {handleSucsess}from './SegaSuccsesHandler'
let feedApi = new FeedApi();

function* backgroundTask(token, lastId, group, user) {
    try {
        let id = lastId;
        let delayTime = 1000;
        while (true) {
            if (delayTime > 120000) {
                delayTime = 120000;
            }
            yield call(delay, delayTime);
            let response = yield call(feedApi.getAll, 'up', id, token, group);
            handleSucsess();
            if (response.length > 0) {
                yield* updateFeedsTop(response, group, user);
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
        const {token, group, user, id} = yield take(segaActions.LISTEN_FOR_GROUP_FEED);
        yield race({
            task: call(backgroundTask, token, id, group, user),
            cancel: take(segaActions.CANCEL_GROUP_FEED_LISTENER)
        })
    }
}

function* groupFeedSega() {
    yield fork(watchStartBackgroundTask);
}

export default groupFeedSega;