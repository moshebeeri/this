import {call, put, throttle} from 'redux-saga/effects'
import PromotionApi from "../api/promotion";
import {setPromotion, setSinglePromotion} from "../actions/promotions";
import * as sagaActions from './sagaActions'
import ImageApi from "../api/image";
import productApi from "../api/product";
import InstanceApi from "../api/instances";
import {setProduct} from "../actions/product";
import {handleSucsess} from './SagaSuccsesHandler'
import FeedApi from "../api/feed";
import NotificationApi from "../api/notification";
import * as actions from '../reducers/reducerActions';

let notificationApi = new NotificationApi();
let promotionApi = new PromotionApi();
let feedApi = new FeedApi();
let instanceApi = new InstanceApi();

function* savePromotion(action) {
    try {
        let tempPromotion = action.promotion;
        // add default product in case of simple promotion
        let promotionProduct;
        let uploadProductPicture = false;
        if (action.simpleProductPercent) {
            let products;
            if (action.products) {
                products = action.products.filter(product => product.name.toUpperCase() === tempPromotion.name.toUpperCase())
            }
            if (products && products.length > 0) {
                //Product with the same name already exist
                promotionProduct = products[0];
            } else {
                // add product flow
                let product = {
                    name: tempPromotion.name,
                    category: [247183, 247467],
                    business: tempPromotion.entity.business,
                    retail_price: tempPromotion.retail_price,
                }
                promotionProduct = yield call(productApi.createProduct, product, action.token);
                handleSucsess();
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

function* updatePromotionSocialState(action) {
    try {
        let response = yield call(feedApi.getFeedSocialState, action.id, action.token);
        yield put(setSinglePromotion(response, action.businessId, action.item))
    } catch (error) {
        console.log("failed saveMyPromotionsRequest");
    }
}

function* handleNotification(action) {
    try {
        yield call(notificationApi.readNotification, action.token, action.notificationId);
        let instance = yield call(instanceApi.getInstance, action.token, action.instanceId);
        yield put({
            type: actions.APP_SHOW_PROMOTION_POPUP,
            showPopup: true,
            instance: instance,
            notificationId: action.notificationId
        });
    } catch (error) {
        console.log("failed saveMyPromotionsRequest");
    }
}

function* promotionSaga() {
    yield throttle(2000, sagaActions.SAVE_PROMOTION, savePromotion);
    yield throttle(2000, sagaActions.UPDATE_PROMOTION, updatePromotionSocialState);
    yield throttle(2000, sagaActions.PROMOTION_NOTIFICATION, handleNotification);
}

export default promotionSaga;