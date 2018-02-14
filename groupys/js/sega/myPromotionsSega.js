import {call, put, fork,take} from 'redux-saga/effects'
import ProfileApi from "../api/profile";
import {setSavedPromotions} from "../actions/myPromotions";
import * as segaActions from './segaActions'

let profileApi = new ProfileApi();

function* saveMyPromotionsRequest() {
    const {feeds, token} = yield take(segaActions.SAVE_MYPROMOTIONS_REQUEST);
    try {
        let response = {};
        let numberOfFeeds = 0;
        if(feeds){
            numberOfFeeds = Object.keys(feeds).length;
        }
        if (numberOfFeeds > 0) {
            response = yield call(profileApi.fetch, token, numberOfFeeds, numberOfFeeds + 10);
        } else {
            response = yield call(profileApi.fetch, token, 0, 10);
        }
        let filteredResponse = response.filter(feed => !feeds[feed.savedInstance._id]);
        if(filteredResponse.length >  0) {
            yield put(setSavedPromotions(filteredResponse))
        }
    } catch (error) {
    }
}

function* myPromotionsSega() {
    yield fork( saveMyPromotionsRequest);
}

export default myPromotionsSega;