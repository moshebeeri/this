import {fork} from 'redux-saga/effects'
import userSega from './userSega'
import businessSega from './businessSega'
import feedSega from './feedSega'
import notificationSega from './norificationSega'
import groupsSega from './groupsSega'
import myPromotionsnSega from './myPromotionsSega'
import groupsChatSega from './groupsChatSega'
import promotionSega from './promotionSega'
import productSega from './productSega'
import feedChatSega from './feedChatSega'
import groupInstanceChatSega from './groupInstanceChatSega'
import mainSega from './mainSega'

function* sega() {
    yield fork(userSega);
    yield fork(businessSega);
    yield fork(feedSega);
    yield fork(notificationSega);
    yield fork(myPromotionsnSega);
    yield fork(groupsSega);
    yield fork(groupsChatSega);
    yield fork(promotionSega);
    yield fork(productSega);
    yield fork(feedChatSega);
    yield fork(groupInstanceChatSega);
    yield fork(mainSega);

}

export default sega;