import {fork, put, take} from 'redux-saga/effects'
import * as sagaActions from './sagaActions'
import * as actions from '../reducers/reducerActions'


function* changeTab() {
    while (true) {
        const {tab} = yield take(sagaActions.CHANGE_TAB);
        if(tab === 1){

        }
        yield put({
            type: actions.CURRENT_TAB,
            currentTab: tab
        });
    }
}

function* mainSaga() {
    yield fork(changeTab);
}

export default mainSaga;