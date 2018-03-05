import {call, put, throttle} from 'redux-saga/effects'
import PromotionApi from "../api/promotion";
import {setPromotion} from "../actions/promotions";
import * as segaActions from './segaActions'
import ImageApi from "../api/image";

let promotionApi = new PromotionApi();

function* savePromotion(action) {
    try {
        let response = yield call(promotionApi.createPromotion, action.promotion, action.token);
        //  on-action  returns promotion instead of campaign
        let createdPromotion = response;
        if (response.promotions) {
            createdPromotion = response.promotions[0];
        }
        createdPromotion.pictures = [];
        let pictures = [];
        if (action.promotion.image.path) {
            pictures.push(action.promotion.image.path);
            pictures.push(action.promotion.image.path);
            pictures.push(action.promotion.image.path);
            pictures.push(action.promotion.image.path);
            createdPromotion.pictures.push({pictures: pictures});
        } else {
            pictures.push(action.promotion.image.uri);
            pictures.push(action.promotion.image.uri);
            pictures.push(action.promotion.image.uri);
            pictures.push(action.promotion.image.uri);
            createdPromotion.pictures.push({pictures: pictures});
        }
        createdPromotion.social_state = {};
        createdPromotion.social_state.saves = 0;
        createdPromotion.social_state.comments = 0;
        createdPromotion.social_state.likes = 0;
        createdPromotion.social_state.shares = 0;
        createdPromotion.social_state.realizes = 0;
        yield put(setPromotion(createdPromotion, action.businessId));
        if (action.promotion.image) {
            yield call(ImageApi.uploadImage, action.token, action.promotion.image, createdPromotion._id);
        }
    } catch (error) {
        console.log("failed  updatePromotion");
    }
}

function* promotionSega() {
    yield throttle(2000, segaActions.SAVE_PROMOTION, savePromotion);
}

export default promotionSega;