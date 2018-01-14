import {call, put, takeLatest} from 'redux-saga/effects'
import CollectionDispatcher from '../actions/collectionDispatcher';
import PromotionApi from "../api/promotion";
import GroupApi from "../api/groups";
import BusinessApi from "../api/business";
import FeedApi from "../api/feed";
import NotificationApi from "../api/notification"
import * as actions from "../reducers/reducerActions";
import * as segaActions from './segaActions'

let promotionApi = new PromotionApi();
let groupApi = new GroupApi();
let feedApi = new FeedApi();
let businessApi = new BusinessApi();
let notificationApi = new NotificationApi();

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* וupdateGroups(action) {
    try {
        const response = yield call(groupApi.getAll, action.payload.token);
        yield put({type: actions.UPSERT_GROUP, item: response});
        yield put({type: actions.NETWORK_IS_ONLINE});
    } catch (e) {
        yield put({type: actions.NETWORK_IS_OFFLINE, message: e.message});
    }
}

function* וupdateFeedsMainTop(action) {
    try {
        const response = yield call(feedApi.getAll, 'up', action.payload.id, action.payload.token, action.payload.user);
        if (response.length === 0) {
            return;
        }
        let collectionDispatcher = new CollectionDispatcher();
        // let disassemblerItems = response.map(item => assemblers.disassembler(item, collectionDispatcher));
        // collectionDispatcher.dispatchEvents(dispatchSega, undefined, token);
        // disassemblerItems.forEach(item => {
        //         dispatchSega({type: actions.UPSERT_FEEDS_TOP, item: item})
        //     }
        // )
        // yield put({type: actions.UPSERT_GROUP, item: response});
        // yield put({type: actions.NETWORK_IS_ONLINE});
    } catch (e) {
        console.log('וupdateFeedsMainTop' +e);

        yield put({type: actions.NETWORK_IS_OFFLINE, message: e.message});
    }
}

function* dispatchSega(event) {
    yield put({type: event.type, item: event.item});
}

function* וupdateBusinesses(action) {
    try {
        const response = yield call(businessApi.getAll, action.payload.token);
        yield put({type: actions.UPSERT_MY_BUSINESS, item: response});
        yield put({type: actions.NETWORK_IS_ONLINE});
    } catch (e) {
        yield put({type: actions.NETWORK_IS_OFFLINE, message: e.message});
    }
}

function* updateNotification(action) {
    try {
        let skip = 0;
        if (action.payload.notifications.length >= 10) {
            skip = action.payload.notifications.length - 1;
        }
        const response = yield call(notificationApi.getAll, action.payload.token, action.payload.user, skip, 10);
        yield put({type: actions.SET_NOTIFICATION, item: response});
        yield put({type: actions.NETWORK_IS_ONLINE});
    } catch (e) {
        yield put({type: actions.NETWORK_IS_OFFLINE, message: e.message});
    }
}

function* updateGroupTopList(action) {
    try {
        if (!action.payload.id) {
            return;
        }
        const response = yield call(feedApi.getAll, 'up', action.payload.id, action.payload.token, action.payload.group);
        if (!response)
            return;
        if (response.length === 0) {
            return;
        }
        let collectionDispatcher = new CollectionDispatcher();
        let disassemblerItems = response.map(item => {
            if (item.activity && (item.activity.action === 'group_message' || item.activity.action === 'group_follow')) {
                return item;
            }
            return assemblers.disassembler(item, collectionDispatcher)
        });
       // collectionDispatcher.dispatchEvents(dispatchSega)
       //  yield put({
       //      type: actions.UPSERT_GROUP_FEEDS_TOP,
       //      groupId: action.payload.group._id,
       //      groupFeed: disassemblerItems,
       //      user: action.payload.user
       //  });
        //yield put({type: actions.UPDATE_FEED_GROUP_UNREAD, feeds: response, user: action.payload.user});
        yield put({type: actions.NETWORK_IS_ONLINE});
    } catch (e) {
        console.log('updateGroupTopList' +e);

        yield put({type: actions.NETWORK_IS_OFFLINE, message: e.message});
    }
}

function* updateBusinessPromotions(action) {
    try {
        const response = yield call(promotionApi.getAllByBusinessId, action.payload.businessId, action.payload.token);
        yield put({
            type: actions.SET_PROMOTION_BUSINESS,
            businessesPromotions: response,
            businessId: action.payload.businessId
        });
        yield put({type: actions.NETWORK_IS_ONLINE});
    } catch (e) {
        yield put({type: actions.NETWORK_IS_OFFLINE, message: e.message});
    }
}

/*
  Alternatively you may use takeLatest.

  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
function* mySaga() {
    yield takeLatest(segaActions.GROUP_FETCH_REQUESTED, וupdateGroups);
    yield takeLatest(segaActions.FEED_MAIN_FETCH_REQUESTED, וupdateFeedsMainTop);
    yield takeLatest(segaActions.BUSINESS_FETCH_REQUESTED, וupdateBusinesses);
    yield takeLatest(segaActions.NOTIFICATION_FETCH_REQUESTED, updateNotification);
    yield takeLatest(segaActions.GROUP_FEED_FETCH_TOP_REQUESTED, updateGroupTopList);
    yield takeLatest(segaActions.BUSINESS_PROMOTION_FETCH_REQUESTED, updateBusinessPromotions);
}

export default mySaga;