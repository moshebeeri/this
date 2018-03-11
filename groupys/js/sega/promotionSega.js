import {call, put, throttle} from 'redux-saga/effects'
import PromotionApi from "../api/promotion";
import {setPromotion} from "../actions/promotions";
import * as segaActions from './segaActions'
import ImageApi from "../api/image";
import productApi from "../api/product";
import {setProduct} from "../actions/product";

let promotionApi = new PromotionApi();

function* savePromotion(action) {
    try {
        let tempPromotion = action.promotion;
        // add default product in case of simple promotion
        let promotionProduct;
        let uploadProductPicture = false;
        if (action.simpleProductPercent) {
            let products = action.products.filter(product => product.name.toUpperCase() === tempPromotion.name.toUpperCase())
            if (products.length > 0) {
                //Product with the same name already exist
                promotionProduct = products[0];
            } else {
                // add product flow
                let product = {
                    name: tempPromotion.name,
                    category: [247183, 247467],
                }
                promotionProduct = yield call(productApi.createProduct, product, action.token);
                uploadProductPicture = true;
                let pictures = []
                if (action.promotion.image.path) {
                    pictures.push(action.promotion.image.path);
                    pictures.push(action.promotion.image.path);
                    pictures.push(action.promotion.image.path);
                    pictures.push(action.promotion.image.path);
                    promotionProduct.pictures.push({pictures: pictures});
                } else {
                    pictures.push(action.promotion.image.uri);
                    pictures.push(action.promotion.image.uri);
                    pictures.push(action.promotion.image.uri);
                    pictures.push(action.promotion.image.uri);
                    promotionProduct.pictures.push({pictures: pictures});
                }
                yield put(setProduct(promotionProduct, action.businessId));
            }
            tempPromotion.condition = {product: promotionProduct};
        }
        tempPromotion._id = 'zzzzzzzzzzzzzzzzzzzzzzzzzz' + new Date().getTime();
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
        let tempId = tempPromotion._id;
        tempPromotion._id = '';
        // upload picture after promotion is se
        if (uploadProductPicture) {
            yield call(ImageApi.uploadImage, action.token, action.promotion.image, promotionProduct._id);
        }
        if (action.promotion.image) {
            let imageResponse = yield call(ImageApi.uploadImage, action.token, action.promotion.image, 'image');
            tempPromotion.pictures = imageResponse.pictures;

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

            yield put(setPromotion(createdPromotion, action.businessId, tempId));
        }
    } catch (error) {
        console.log("failed  updatePromotion");
    }
}

function* promotionSega() {
    yield throttle(2000, segaActions.SAVE_PROMOTION, savePromotion);
}

export default promotionSega;