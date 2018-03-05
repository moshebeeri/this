import {fork, put, take} from 'redux-saga/effects'
import * as segaActions from './segaActions'
import * as actions from '../reducers/reducerActions'


function* changeTab() {
    while (true) {
        const {tab} = yield take(segaActions.CHANGE_TAB);
        if(tab === 1){

        }
        yield put({
            type: actions.CURRENT_TAB,
            currentTab: tab
        });
    }
}

function* mainSega() {
    yield fork(changeTab);
}

export default mainSega;