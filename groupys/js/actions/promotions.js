import PromotionsApi from "../api/promotion";
import ProductApi from "../api/product";
import * as actions from "../reducers/reducerActions";
import EntityUtils from "../utils/createEntity";
let promotionApi = new PromotionsApi();
let productApi = new ProductApi();
let entityUtils = new EntityUtils();

async function getAll(dispatch, id, token) {
    try {
        let response = await promotionApi.getAllByBusinessId(id, token);
        if (response.length > 0) {
            dispatch({
                type: 'GET_PROMOTIONS',
                promotions: response,
                businessId: id
            });
        }
    } catch (error) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
    }
}

async function getAllProducts(dispatch, id, token) {
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
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
    }
}

export function fetchPromotions(id) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        getAll(dispatch, id, token);
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
        }catch (error){
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
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
        }catch (error){
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
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
export function savePromotion(promotion,businessId,navigation) {
    return async function (dispatch, getState) {
        try {
            dispatch({
                type: actions.PROMOTION_SAVING,
            });
            const token = getState().authentication.token;
            await promotionApi.createPromotion(promotion,token);
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
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

export function updatePromotion(promotion,businessId,navigation,itemId) {
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
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}
