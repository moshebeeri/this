import {call, fork, put, throttle, takeEvery} from 'redux-saga/effects'
import BusinessApi from "../api/business";
import {businessLoading, businessLoadingDone, setBusinessCategory, updateBusinesses} from "../actions/business";
import * as segaActions from './segaActions'

let businessApi = new BusinessApi();

function* updateBusiness(action) {
     try {
        const response = yield call(businessApi.getAll, action.token, true);
        if(response.length > 0) {
            yield put(updateBusinesses(response))
        }
    } catch (error) {
        //TODO handle error
    }
}

function* updateBusinessFirstTime(action) {
    try {
        yield put(businessLoading());
        const response = yield call(businessApi.getAll, action.token, true);
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
    yield throttle(2000,segaActions.UPDATE_BUSINESS_REQUEST,updateBusiness);
    yield throttle(2000,segaActions.UPDATE_BUSINESS_REQUEST_FIRST_TIME,updateBusinessFirstTime);

    yield takeEvery(segaActions.UPDATE_BUSINESS_CATEGORY_REQUEST, updateCategory);
}

export default businessSega;