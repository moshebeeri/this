import {fork} from 'redux-saga/effects'
import userSega from './userSega'
import businessSega from './businessSega'
import feedSega from './feedSega'

function* sega() {
    yield fork(userSega);
    yield fork(businessSega);
    yield fork(feedSega);
}

export default sega;