import {fork} from 'redux-saga/effects'
import userSega from './userSega'
import businessSega from './businessSega'
import feedSega from './feedSega'
import notificationSega from './norificationSega'
import myPromotionsnSega from './myPromotionsSega'


function* sega() {
    yield fork(userSega);
    yield fork(businessSega);
    yield fork(feedSega);
    yield fork(notificationSega);
    yield fork(myPromotionsnSega);

}

export default sega;