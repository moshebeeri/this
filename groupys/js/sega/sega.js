import {fork} from 'redux-saga/effects'
import userSega from './userSega'
import businessSega from './businessSega'
import feedSega from './feedSega'
import notificationSega from './norificationSega'
import groupsSega from './groupsSega'
import myPromotionsnSega from './myPromotionsSega'
import groupsChatSega from './groupsChatSega'
import promotionSega from './promotionSega'

function* sega() {
    yield fork(userSega);
    yield fork(businessSega);
    yield fork(feedSega);
    yield fork(notificationSega);
    yield fork(myPromotionsnSega);
    yield fork(groupsSega);
    yield fork(groupsChatSega);
    yield fork(promotionSega);

}

export default sega;