import {call, put, throttle} from 'redux-saga/effects'
import ProfileApi from "../api/profile";
import {setSavedPromotions} from "../actions/myPromotions";
import * as sagaActions from './sagaActions';
import * as actions from '../reducers/reducerActions';

let profileApi = new ProfileApi();

function* saveMyPromotionsRequest(action) {
    try {
        let response = yield call(profileApi.fetch, action.token, 0, 30);
        let filteredResponse = response.filter(feed => !action.feeds[feed.savedInstance._id]);
        if (filteredResponse.length > 0) {
            yield put(setSavedPromotions(filteredResponse))
        }
    } catch (error) {
        console.log(`failed saveMyPromotionsRequest ${error}`);
    }
}

function* saveMyPromotionsSingleRequest(action) {
    try {
        let savedInstances = [];
        let feed = {};
        feed.savedInstance = action.item;
        feed.savedInstance.feedId = action.feedId;
        savedInstances.push(feed);
        yield put(setSavedPromotions(savedInstances))
    } catch (error) {
        console.log("failed saveMyPromotionsSingleRequest");
    }
}

function* updateSavedInstance(action) {
    try {
        let response = yield call(profileApi.getSavedInstance, action.token, action.savedInstanceId);
        let savedInstance = {};
        savedInstance.savedInstance = response;
        yield put({
            type: actions.UPDATE_SINGLE_SAVED_INSTANCE,
            item: savedInstance
        })
    } catch (error) {
        console.log("failed saveMyPromotionsRequest");
    }
}

function* myPromotionsSaga() {
    yield throttle(10000, sagaActions.SAVE_MYPROMOTIONS_REQUEST, saveMyPromotionsRequest);
    yield throttle(2000, sagaActions.SAVE_SINGLE_MYPROMOTIONS_REQUEST, saveMyPromotionsSingleRequest);
    yield throttle(2000, sagaActions.UPDATE_SINGLE_MYPROMOTIONS_REQUEST, updateSavedInstance);
}

export default myPromotionsSaga;