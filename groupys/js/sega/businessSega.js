import {call, fork, put, take, takeEvery} from 'redux-saga/effects'
import BusinessApi from "../api/business";
import {businessLoading, businessLoadingDone, setBusinessCategory, updateBusinesses} from "../actions/business";
import * as segaActions from './segaActions'

let businessApi = new BusinessApi();

function* updateBusiness() {
    const {token,} = yield take(segaActions.UPDATE_BUSINESS_REQUEST);
    try {
        const response = yield call(businessApi.getAll, token, true);
        if(response.length > 0) {
            yield put(updateBusinesses(response))
        }
    } catch (error) {
        //TODO handle error
    }
}

function* updateBusinessFirstTime() {
    const {token,} = yield take(segaActions.UPDATE_BUSINESS_REQUEST_FIRST_TIME);
    try {
        yield put(businessLoading());
        const response = yield call(businessApi.getAll, token, true);
        if(response.length > 0 ) {
            yield put(updateBusinesses(response));
        }
        yield put(businessLoadingDone());
    } catch (error) {
        yield put(businessLoadingDone());
        //TODO handle error
    }
}

function* updateCategory(action) {
    try {
        console.log(action);
        const response = yield call(businessApi.getSubCategory, action.token, action.business.business.subcategory, action.locale);
        yield put(setBusinessCategory(response, action.business));
    } catch (error) {
        console.log(error)
        //TODO handle error
    }
}

function* businessSega() {
    yield fork(updateBusiness);
    yield fork(updateBusinessFirstTime);
    yield takeEvery(segaActions.UPDATE_BUSINESS_CATEGORY_REQUEST, updateCategory);
}

export default businessSega;