import {fork} from 'redux-saga/effects'
import userSega from './userSega'
import businessSega from './businessSega'
import feedSega from './feedSega'
import notificationSega from './norificationSega'


function* sega() {
    yield fork(userSega);
    yield fork(businessSega);
    yield fork(feedSega);
    yield fork(notificationSega);

}

export default sega;