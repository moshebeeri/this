import {fork} from 'redux-saga/effects'
import userSaga from './userSaga'
import businessSaga from './businessSaga'
import feedSaga from './feedSaga'
import notificationSaga from './norificationSaga'
import groupsSaga from './groupsSaga'
import myPromotionsnSaga from './myPromotionsSaga'
import groupsChatSaga from './groupsChatSaga'
import promotionSaga from './promotionSaga'
import productSaga from './productSaga'
import feedChatSaga from './feedChatSaga'
import groupInstanceChatSaga from './groupInstanceChatSaga'
import mainSaga from './mainSaga'
import groupFeedSaga from './groupFeedSaga'
import postSaga from './postSaga'

function* saga() {
    yield fork(userSaga);
    yield fork(businessSaga);
    yield fork(feedSaga);
    yield fork(notificationSaga);
    yield fork(myPromotionsnSaga);
    yield fork(groupsSaga);
    yield fork(groupsChatSaga);
    yield fork(promotionSaga);
    yield fork(productSaga);
    yield fork(feedChatSaga);
    yield fork(groupInstanceChatSaga);
    yield fork(mainSaga);
    yield fork(groupFeedSaga);
    yield fork(postSaga);

}

export default saga;