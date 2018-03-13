import {put} from 'redux-saga/effects'
import * as actions from '../reducers/reducerActions'

export function* handleSucsess() {
    yield put({
        type: actions.NETWORK_IS_ONLINE,
    });
}

