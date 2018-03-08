import {call, put, throttle} from 'redux-saga/effects'
import PromotionApi from "../api/promotion";
import {setPromotion} from "../actions/promotions";
import * as segaActions from './segaActions'
import ImageApi from "../api/image";
import * as actions from "../reducers/reducerActions";
let promotionApi = new PromotionApi();

function* savePromotion(action) {
    try {

        let tempPromotion =  action.promotion;
        tempPromotion._id =  'zzzzzzzzzzzzzzzzzzzzzzzzzz' + new Date().getTime() ;
        tempPromotion.temp = true;
        tempPromotion.pictures = [];
        let pictures = [];
        if (action.promotion.image.path) {
            pictures.push(action.promotion.image.path);
            pictures.push(action.promotion.image.path);
            pictures.push(action.promotion.image.path);
            pictures.push(action.promotion.image.path);
            tempPromotion.pictures.push({pictures: pictures});
        } else {
            pictures.push(action.promotion.image.uri);
            pictures.push(action.promotion.image.uri);
            pictures.push(action.promotion.image.uri);
            pictures.push(action.promotion.image.uri);
            tempPromotion.pictures.push({pictures: pictures});
        }
        tempPromotion.social_state = {};
        tempPromotion.social_state.saves = 0;
        tempPromotion.social_state.comments = 0;
        tempPromotion.social_state.likes = 0;
        tempPromotion.social_state.shares = 0;
        tempPromotion.social_state.realizes = 0;
        yield put(setPromotion(tempPromotion, action.businessId));

        if (action.promotion.image) {
            let imageResponse = yield call(ImageApi.uploadImage, action.token, action.promotion.image, 'image');
            tempPromotion.pictures = imageResponse.pictures;
            let tempId = tempPromotion._id;
            tempPromotion._id = undefined;
            let response = yield call(promotionApi.createPromotion, tempPromotion, action.token);
            let createdPromotion = response;
            if (response.promotions) {
                createdPromotion = response.promotions[0];
            }
            createdPromotion.social_state = {};
            createdPromotion.social_state.saves = 0;
            createdPromotion.social_state.comments = 0;
            createdPromotion.social_state.likes = 0;
            createdPromotion.social_state.shares = 0;
            createdPromotion.social_state.realizes = 0;
            yield put(setPromotion(createdPromotion, action.businessId,tempId));
        }




    } catch (error) {
        console.log("failed  updatePromotion");
    }
}

function* promotionSega() {
    yield throttle(2000, segaActions.SAVE_PROMOTION, savePromotion);
}

export default promotionSega;