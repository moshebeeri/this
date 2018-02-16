import {call, put, fork,take} from 'redux-saga/effects'
import ProfileApi from "../api/profile";
import {setSavedPromotions} from "../actions/myPromotions";
import * as segaActions from './segaActions'

let profileApi = new ProfileApi();

function* saveMyPromotionsRequest(action) {
    try {
        console.log('fectch saved')


        let response = yield call(profileApi.fetch, action.token, 0, 30);

        console.log(response);
        let filteredResponse = response.filter(feed => {
            if(!action.feeds[feed.savedInstance._id]){
                return true;
            }

            return false;

        });
        console.log(filteredResponse)
        if(filteredResponse.length >  0) {
            yield put(setSavedPromotions(filteredResponse))
        }
    } catch (error) {
        console.log('error')
    }
}

function* saveMyPromotionsSingleRequest(action) {
    try {
        let savedInstances =[];
        let feed={}
        feed.savedInstance = action.item;
        savedInstances.push(feed);

        yield put(setSavedPromotions(savedInstances))

    } catch (error) {
        console.log('error')
    }
}


function* myPromotionsSega() {
    yield takeLatest( segaActions.SAVE_MYPROMOTIONS_REQUEST,saveMyPromotionsRequest);
    yield takeLatest( segaActions.SAVE_SINGLE_MYPROMOTIONS_REQUEST,saveMyPromotionsSingleRequest);
}

export default myPromotionsSega;