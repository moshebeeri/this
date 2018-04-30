import PromotionsApi from "../api/promotion";
import productApi from "../api/product";
import FeedApi from "../api/feed";
import * as actions from "../reducers/reducerActions";
import ActionLogger from './ActionLogger'
import handler from './ErrorHandler'
import PromotionComperator from "../reduxComperators/PromotionComperator"
import * as types from '../saga/sagaActions';
import SyncerUtils from "../sync/SyncerUtils";
let promotionComperator = new PromotionComperator();
let promotionApi = new PromotionsApi();
let feedApi = new FeedApi();
let logger = new ActionLogger();

async function getAll(dispatch, id, token, loading) {
    try {
        let response = await promotionApi.getAllByBusinessId(id, token);
        if (response.length > 0) {
            dispatch({
                type: 'GET_PROMOTIONS',
                promotions: response,
                businessId: id
            });
        }
        if (loading) {
            dispatch({
                type: actions.PROMOTION_LOADING_DONE,
            });
        }
    } catch (error) {
        handler.handleError(error, dispatch)
        await logger.actionFailed('promotions-getAll')
    }
}

async function getAllProducts(dispatch, id, token, loading) {
    try {
        let response = await productApi.findByBusinessId(id, token);
        if (response.length > 0) {
            dispatch({
                type: actions.SET_PRODUCT_BUSINESS,
                businessProducts: response,
                businessId: id
            });
        }
    } catch (error) {
        handler.handleError(error, dispatch)
        await logger.actionFailed('promotions-getAllProducts')
    }
}

export function fetchPromotions(id) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        const loading = getState().promotions.loading;
        getAll(dispatch, id, token, loading);
    }
}

export function fetchProducts(id) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        getAllProducts(dispatch, id, token);
    }
}

export function realizePromotion(code) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        try {
            await promotionApi.realizePromotion(code, token)
            dispatch({
                type: actions.SCAN_QRCODE_CLEAR,
            });
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch)
            await logger.actionFailed('promotions-realizePromotion')
        }
    }
}

export function setPromotionDescription(code) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        try {
            let instance = await promotionApi.getPromotionInstance(code, token)
            dispatch({
                type: actions.SCAN_QRCODE_INSTANCE,
                instance: instance
            });
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch)
            await logger.actionFailed('promotions-setPromotionDescription')
        }
    }
}

export function clearRealizationForm() {
    return function (dispatch) {
        dispatch({
            type: actions.SCAN_QRCODE_CLEAR,
        });
    }
}

export function resetForm() {
    return function (dispatch) {
        dispatch({
            type: actions.PROMOTION_RESET,
        });
    }
}

export function savePromotion(promotion, businessId, navigation, simpleProductPercent) {
    return async function (dispatch, getState) {
        try {
            dispatch({
                type: actions.PROMOTION_SAVING,
            });
            const token = getState().authentication.token;
            const products = getState().businesses.businessesProducts[businessId];
            dispatch({
                type: types.SAVE_PROMOTION,
                promotion: promotion,
                businessId: businessId,
                token: token,
                products: products,
                simpleProductPercent: simpleProductPercent
            });
            if (promotion.on_action) {
                if (promotion.on_action.type === 'FOLLOW_ENTITY') {
                    dispatch({
                        type: actions.SAVE_ON_BOARDING_PROMOTIONS,
                        onBoardingPromotion: promotion,
                        businessId: businessId,
                    });
                } else {
                    if (promotion.on_action.type === 'FOLLOWER_PROXIMITY') {
                        dispatch({
                            type: actions.SAVE_ON_FOLLOER_PROXIMITY_PROMOTIONS,
                            followerProximity: promotion,
                            businessId: businessId,
                        });
                    } else {
                        dispatch({
                            type: actions.SAVE_ON_PROXIMITY_PROMOTIONS,
                            proximityPromotion: promotion,
                            businessId: businessId,
                        });
                    }
                }
            }
            dispatch({
                type: actions.PROMOTION_SAVING_DONE,
            });
            navigation.goBack();
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            dispatch({
                type: actions.PROMOTION_SAVING_FAILED,
            });
            handler.handleError(error, dispatch)
            dispatch({
                type: actions.PROMOTION_SAVING_DONE,
            });
            await logger.actionFailed('promotions-savePromotion')
        }
    }
}

export function updatePromotion(promotion, businessId, navigation, itemId) {
    return async function (dispatch, getState) {
        try {
            dispatch({
                type: actions.PROMOTION_SAVING,
            });
            const token = getState().authentication.token;
            await promotionApi.updatePromotion(promotion, itemId);
            let response = await promotionApi.getAllByBusinessId(businessId, token);
            if (response.length > 0) {
                dispatch({
                    type: actions.SET_PROMOTION_BUSINESS,
                    businessesPromotions: response,
                    businessId: businessId
                });
            }
            dispatch({
                type: actions.PROMOTION_SAVING_DONE,
            });
            navigation.goBack();
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch)
            await logger.actionFailed('promotions-updatePromotion')
        }
    }
}

async function refershBusinessPromotion(item, businessId, token, dispatch) {
    try {
        let response = await feedApi.getFeedSocialState(item._id, token);
        if (!response)
            return;
        if (promotionComperator.shouldUpdateSocial(item, response)) {
            item.social_state = response;
            dispatch({
                type: actions.UPSERT_PROMOTION_SINGLE,
                item: item,
                businessId: businessId
            });
        }
    } catch (error) {
        handler.handleError(error, dispatch)
        await logger.actionFailed('promotions-fetchPromotionById')
    }
}

async function fetchPromotionById(id, token, dispatch) {
    try {
        let response = await promotionApi.getPromotionById(id, token);
        if (!response)
            return;
        dispatch({
            type: actions.UPSERT_PROMOTION,
            item: [response]
        });
    } catch (error) {
        handler.handleError(error, dispatch)
        await logger.actionFailed('promotions-fetchPromotionById')
    }
}

export function setPromotion(response, businessId, removeId) {
    return {
        type: actions.UPSERT_PROMOTION_SINGLE,
        item: response,
        businessId: businessId,
        removeId: removeId
    }
}

export function setSinglePromotion(response, businessId, item) {
    item.social_state = response;
    return {
        type: actions.UPSERT_PROMOTION_SINGLE,
        item: item,
        businessId: businessId
    }
}



export function* setPromotionListener(promotion) {
    yield put({
        type: actions.PROMOTION_LISTENER,
        id: promotion._id
    });
    SyncerUtils.syncPromotion(promotion._id);

}

