/**
 * Created by roilandshut on 12/06/2017.
 */
import BusinessApi from "../api/business";
import UserApi from "../api/user";
import productApi from "../api/product";
import PricingApi from "../api/pricing";
import imageApi from "../api/image";
import PromotionApi from "../api/promotion";
import * as actions from "../reducers/reducerActions";
import EntityUtils from "../utils/createEntity";
import SyncerUtils from "../sync/SyncerUtils";
import FormUtils from "../utils/fromUtils";
import handler from './ErrorHandler'
import BusinessComperator from "../reduxComperators/BusinessComperator"
import * as errors from '../api/Errors'
import ActionLogger from './ActionLogger'
import * as types from '../saga/sagaActions';
import {put} from 'redux-saga/effects'

const BTClient = require('react-native-braintree-xplat');
let businessApi = new BusinessApi();
let userApi = new UserApi();
let promotionApi = new PromotionApi();
let entityUtils = new EntityUtils();
let pricingApi = new PricingApi();
let businessComperator = new BusinessComperator();
let logger = new ActionLogger();

async function get(dispatch, token, id) {
    try {
        let response = await businessApi.get(token, id);
        let businesses = [response];
        if (response.length > 0) {
            dispatch({
                type: actions.UPSERT_BUSINESS,
                item: businesses
            });
        }
    } catch (error) {
        handler.handleError(error, dispatch, 'get - business')
        await logger.actionFailed("business_get");
    }
}

async function getBusinessCategories(dispatch, gid, token) {
    try {
        if (gid) {
            let response = await businessApi.getBusinessCategories(gid, token);
            dispatch({
                type: actions.SET_BUSINESS_CATEGORIES,
                categories: response,
                language: FormUtils.getLocale(),
                catId: gid
            });
        }
    } catch (error) {
        handler.handleError(error, dispatch, 'getBusinessCategories')
        await logger.actionFailed("business_get_Categories", gid);
    }
}

async function dispatchSearchBusiness(dispatch, business, token) {
    try {
        dispatch({type: actions.SHOW_SEARCH_SPIN, searching: true});
        dispatch({type: actions.SHOW_CAMERA, cameraOn: false});
        let response = await businessApi.searchBusiness(business, token);
        dispatch({type: actions.SEARCH_BUSINESS, businesses: response});
        dispatch({type: actions.SHOW_SEARCH_SPIN, searching: false})
    } catch (error) {
        handler.handleError(error, dispatch, 'dispatchSearchBusiness')
        await logger.actionFailed("business_search_business", business);
    }
}

async function dispatchFollowByQrcode(dispatch, barcode, token) {
    try {
        dispatch({type: actions.SHOW_SEARCH_SPIN, searching: true});
        dispatch({type: actions.SHOW_CAMERA, cameraOn: false});
        if (barcode.type && barcode.type === 'QR_CODE') {
            let data = JSON.parse(barcode.data);
            if (data.code) {
                let response = await imageApi.getQrCodeImage(data.code, token);
                if (response && response.assignment && response.assignment.business) {
                    dispatch({type: actions.SEARCH_BUSINESS, businesses: [response.assignment.business]})
                } else {
                    dispatch({type: actions.SEARCH_BUSINESS, businesses: []})
                }
            }
        }
        dispatch({type: actions.SHOW_SEARCH_SPIN, searching: false})
    } catch (error) {
        handler.handleError(error, dispatch, 'dispatchFollowByQrcode')
        await logger.actionFailed("business_search_by_qrcode");
    }
}

export function searchUserBusinessesByPhoneNumber(phoneNumber, navigation) {
    return async function (dispatch, getState) {
        try {
            dispatch({
                type: actions.USER_BUSINESS_BY_PHONE_SHOW_SPINNER,
                show: true,
            });
            dispatch({
                type: actions.USER_BUSINESS_BY_PHONE_SHOW_MESSAGE,
                show: false,
                message: '',
            });
            const token = getState().authentication.token;
            let {user, info} = await businessApi.getUserBusinessesByPhoneNumber(phoneNumber, token);
            if (user && info) {
                dispatch({
                    type: actions.USER_BUSINESS_BY_PHONE_SET_DATA,
                    user,
                    info
                });
            } else {
                dispatch({
                    type: actions.USER_BUSINESS_BY_PHONE_SHOW_MESSAGE,
                    show: true,
                    message: "User not found",
                });
            }
            dispatch({
                type: actions.USER_BUSINESS_BY_PHONE_SHOW_SPINNER,
                show: false,
            });
            handler.handleSuccses(getState(), dispatch);
            //navigation.goBack();
        } catch (error) {
            handler.handleError(error, dispatch, 'UserBusinessesByPhoneNumber');
            await logger.actionFailed('UserBusinessesByPhoneNumber');
        }
    }
}

export function searchBusiness(business) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        dispatchSearchBusiness(dispatch, business, token);
    }
}

export function showSearchForm(searchType, searchPlaceHolder) {
    return function (dispatch) {
        dispatch({type: actions.SEARCH_PARAMS, searchType: searchType, searchPlaceHolder: searchPlaceHolder})
    }
}

export function followByQrCode(barcode) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        dispatchFollowByQrcode(dispatch, barcode, token);
    }
}

export function showCamera() {
    return function (dispatch, getState) {
        dispatch({type: actions.SHOW_CAMERA, cameraOn: true})
    }
}

export function selectBusiness(business) {
    return function (dispatch,) {
        dispatch({
            type: actions.SELECT_BUSINESS,
            selectedBusiness: business
        });
    }
}

export function followBusiness(businessId) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const businessFollowed = getState().following.followBusiness;
            if (!businessFollowed[businessId]) {
                await businessApi.followBusiness(businessId, token);
                dispatch({type: actions.RESET_FOLLOW_FORM})
                dispatch({type: actions.USER_FOLLOW_BUSINESS, id: businessId});
            }
        } catch (error) {
            handler.handleError(error, dispatch, 'followBusiness')
            await logger.actionFailed("business_followBusiness", businessId)
        }
    }
}

export function unFollowBusiness(businessId) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            await businessApi.unFollowBusiness(businessId, token);
            dispatch({type: actions.USER_UNFOLLOW_BUSINESS, id: businessId});
        } catch (error) {
            handler.handleError(error, dispatch, 'unFollowBusiness')
            await logger.actionFailed("business_followBusiness", businessId)
        }
    }
}

export function groupFollowBusiness(groupid, businessId, navigation) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            await businessApi.groupFollowBusiness(groupid, businessId, token);
            dispatch({type: actions.RESET_FOLLOW_FORM})
            navigation.goBack();
        } catch (error) {
            handler.handleError(error, dispatch, 'groupFollowBusiness')
            await logger.actionFailed("business_groupFollowBusiness", businessId)
        }
    }
}

export function fetchBusinessCategories(gid) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        getBusinessCategories(dispatch, gid, token);
    }
}

export function fetchBusiness(id) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        get(dispatch, token, id);
    }
}

export function setBusinessUsers(businessId) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        try {
            let users = await userApi.getBusinessUsers(businessId, token);
            dispatch({
                type: actions.SET_USER_BUSINESS,
                businessUsers: users,
                businessId: businessId
            });
        } catch (error) {
            handler.handleError(error, dispatch, 'setBusinessUsers')
            await logger.actionFailed("users_getBusinessUsers", businessId);
        }
    }
}

export function setBusinessProducts(businessId) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        try {
            let products = await productApi.findByBusinessId(businessId, token);
            dispatch({
                type: actions.SET_PRODUCT_BUSINESS,
                businessProducts: products,
                businessId: businessId
            });
            if (!getState().products.loadingDone[businessId]) {
                dispatch({
                    type: actions.PRODUCT_LOADING_DONE,
                    businessId: businessId
                });
            }
        } catch (error) {
            handler.handleError(error, dispatch, 'setBusinessProducts');
            await logger.actionFailed("product_findByBusinessId", businessId);
        }
    }
}

export function setBusinessPromotions(businessId) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        try {
            let promotions = await promotionApi.getAllByBusinessId(businessId, token);
            dispatch({
                type: actions.SET_PROMOTION_BUSINESS,
                businessesPromotions: promotions,
                businessId: businessId
            });
            if (!getState().promotions.loadingDone[businessId]) {
                dispatch({
                    type: actions.PROMOTION_LOADING_DONE,
                    businessId: businessId
                });
            }
            let values = Object.values(promotions);
            let promotion;
            while (promotion = values.pop()) {
                dispatch({
                    type: actions.PROMOTION_LISTENER,
                    id: promotion._id
                });
                SyncerUtils.syncPromotion(promotion._id);
            }
        } catch (error) {
            handler.handleError(error, dispatch, 'setBusinessPromotions')
            dispatch({
                type: actions.PROMOTION_LOADING_DONE,
                businessId: businessId
            });
            await logger.actionFailed("promotion_findByBusinessId", businessId);
        }
    }
}

async function updateBusinessPromotions(businessId, token, dispatch) {
    try {
        let promotions = await promotionApi.getAllByBusinessId(businessId, token);
        dispatch({
            type: actions.SET_PROMOTION_BUSINESS,
            businessesPromotions: promotions,
            businessId: businessId
        });
    } catch (error) {
        if (error === errors.NETWORK_ERROR) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
        await logger.actionFailed("promotion_getAllByBusinessId", businessId);
    }
}

function saveBusinessFailed() {
    return function (dispatch) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
    }
}

export function saveBusiness(business, navigation) {
    return async function (dispatch, getState) {
        try {
            dispatch({
                type: actions.SAVING_BUSINESS,
            });
            const token = getState().authentication.token;
            dispatch({
                type: types.SAVE_BUSINESS,
                business: business,
                token: token,
                dispatch: dispatch,
                state: getState(),
            });
            dispatch({
                type: actions.SAVE_BUSINESS_TAMPLATE,
                templateBusiness: {},
            });
            dispatch({
                type: actions.SAVING_BUSINESS_DONE,
            });
            navigation.goBack();
        } catch (error) {
            handler.handleError(error, dispatch, 'saveBusiness')
            dispatch({
                type: actions.SAVING_BUSINESS_DONE,
            });
            await logger.actionFailed("create_business", business);
        }
    }
}

export function updateBusiness(business, navigation) {
    return async function (dispatch, getState) {
        try {
            dispatch({
                type: actions.SAVING_BUSINESS,
            });
            const token = getState().authentication.token;
            dispatch({
                type: types.UPDATE_BUSINESS,
                business: business,
                token: token
            });
            dispatch({
                type: actions.SAVING_BUSINESS_DONE,
            });
            dispatch({
                type: actions.SAVE_BUSINESS_TAMPLATE,
                templateBusiness: {},
            });
            navigation.goBack();
        } catch (error) {
            handler.handleError(error, dispatch, 'update_business')
            await logger.actionFailed("update_business", business);
        }
    }
}

export function resetFollowForm() {
    return async function (dispatch,) {
        dispatch({
            type: actions.RESET_FOLLOW_FORM,
        });
    }
}

export function setBusinessQrCode(business) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            dispatch({
                type: actions.REST_BUSINESS_QRCODE,
            });
            if (business.qrcode) {
                let response = await imageApi.getQrCodeImage(business.qrcode, token);
                dispatch({
                    type: actions.UPSERT_BUSINESS_QRCODE,
                    business: business,
                    qrcodeSource: response.qrcode
                });
            }
        } catch (error) {
            handler.handleError(error, dispatch, 'setBusinessQrCode')
            await logger.actionFailed("business_getBusinessQrCodeImage", business);
        }
    }
}

export function doPaymentTransaction(amount) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            dispatch({
                type: actions.PAYMENT_SUCCSESS,
                message: '',
            });
            let response = await pricingApi.checkoutNew(token);
            BTClient.setup(response.clientToken);
            let options = {
                bgColor: '#FFF',
                tintColor: 'orange',
                amount: amount,
                callToActionText: 'For extra points'
            }
            let nonce = await BTClient.showPaymentViewController(options);
            let request = {
                payment_method_nonce: nonce,
                amount: amount
            }
            let paymentResponse = await pricingApi.checkoutRequest(request, token);
            if (paymentResponse.result && paymentResponse.result.icon === 'success') {
                dispatch({
                    type: actions.PAYMENT_SUCCSESS,
                    message: 'Payment Succeeded',
                });
                let businesses = await businessApi.getAll(token);
                dispatch({
                    type: actions.UPSERT_MY_BUSINESS,
                    item: businesses
                });
            } else {
                dispatch({
                    type: actions.PAYMENT_SUCCSESS,
                    message: 'Payment Failed',
                });
            }
        } catch (error) {
            handler.handleError(error, dispatch, 'doPaymentTransaction')
            dispatch({
                type: actions.PAYMENT_SUCCSESS,
                message: 'Payment Failed',
            });
        }
    }
}

export function resetPaymentForm() {
    return async function (dispatch) {
        dispatch({
            type: actions.PAYMENT_SUCCSESS,
            message: '',
        });
    }
}

export function checkFreeTier(business) {
    return async function (dispatch, getState) {
        try {
            dispatch({
                type: actions.SAVING_BUSINESS,
            });
            const token = getState().authentication.token;
            if (!business.pricing) {
                await pricingApi.createBusinessPricing(business._id, token);
                let businesses = await businessApi.getAll(token);
                dispatch({
                    type: actions.UPSERT_MY_BUSINESS,
                    item: businesses
                });
            }
        } catch (error) {
            handler.handleError(error, dispatch, 'checkFreeTier')
        }
    }
}

export function saveBusinessTemplate(templateBusiness) {
    return async function (dispatch) {
        dispatch({
            type: actions.SAVE_BUSINESS_TAMPLATE,
            templateBusiness: templateBusiness,
        });
    }
}

export function getNextBusinessFollowers(businessId) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        const followers = getState().businesses.allBusinessFollowers[businessId];
        let skip = 0;
        if (followers) {
            skip = followers.length;
        }
        dispatch({type: types.UPDATE_BUSINESS_FOLLOWERS, businessId: businessId, token: token, skip: skip, limit: 10})
    }
}

export function getBusinessTopFollowers(businessId) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        dispatch({type: types.UPDATE_BUSINESS_FOLLOWERS, businessId: businessId, token: token, skip: 0, limit: 10})
    }
}

export function resetForm() {
    return async function (dispatch) {
        dispatch({
            type: actions.SAVE_BUSINESS_TAMPLATE,
            templateBusiness: {},
        });
    }
}

export function deleteBusinessProduct(product, businessId) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            dispatch({
                type: types.DELETE_PRODUCT,
                product: product,
                businessId: businessId,
                token: token
            });
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch)
            await logger.actionFailed('product-saveProduct')
        }
    }
}

//////////// MOVE TO SAGA ACTIONS ////////////////////////////
export function resetSave() {
    return async function (dispatch) {
        dispatch({
            type: actions.SAVING_BUSINESS_DONE,
        });
    }
}

async function getAll(dispatch, token) {
    dispatch({
        type: types.UPDATE_BUSINESS_REQUEST,
        token: token,
    })
}

export function* updateBusinesses(response) {
    yield put({
        type: actions.UPSERT_MY_BUSINESS,
        item: response
    });
}

export function* updateBusinessesProducts(response, businessId) {
    if (response.length > 0) {
        yield put({
            type: actions.SET_PRODUCT_BUSINESS,
            businessProducts: response,
            businessId: businessId
        });
    }
}

export function* updateBusinessesPromotions(response, businessId) {
    if (response.length > 0) {
        yield put({
            type: actions.SET_PROMOTION_BUSINESS,
            businessesPromotions: response,
            businessId: businessId
        });
        let values = Object.values(response);
        let promotion;
        while (promotion = values.pop()) {
            yield put({
                type: actions.PROMOTION_LISTENER,
                id: promotion._id
            });
            SyncerUtils.syncPromotion(promotion._id);
        }
    }
}

export function* updateBusinessesUsers(response, businessId) {
    if (response.length > 0) {
        yield put({
            type: actions.SET_USER_BUSINESS,
            businessUsers: response,
            businessId: businessId
        });
    }
}

export function* updateBusinessesListeners(response) {
    if (response.length > 0) {
        let values = Object.values(response);
        let business;
        while (business = values.pop()) {
            yield put({
                type: actions.BUSINESS_LISTENER,
                id: business.business._id
            });
            SyncerUtils.addMyBusinessSync(business.business._id);
        }
    }
}

export function setBusinessCategory(response, business) {
    business.categoryTitle = response;
    return {
        type: actions.UPSERT_MY_BUSINESS_SINGLE,
        item: business
    }
}

export function businessLoading() {
    return {
        type: actions.BUSSINESS_LOADING,
    }
}

export function businessLoadingDone() {
    return {
        type: actions.BUSSINESS_LOADING_DONE,
    }
}

export function onEndReached() {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        dispatch({
            type: types.UPDATE_BUSINESS_REQUEST_FIRST_TIME,
            token: token,
        })
    }
}

export function updateBusinesStatuss() {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        dispatch({
            type: types.UPDATE_BUSINESS_REQUEST,
            token: token,
        })
    }
}

export function updateBusinesCategory(item) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        let locale = FormUtils.getLocale();
        dispatch({
            type: types.UPDATE_BUSINESS_CATEGORY_REQUEST,
            token: token,
            business: item,
            locale: locale
        })
    }
}

export function removeUser(user, businessId) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        await userApi.removeUserRole(user._id, businessId, token);
        let users = await userApi.getBusinessUsers(businessId, token);
        SyncerUtils.invokeBusinessUserChange(businessId);
        SyncerUtils.invokeBusinessChange(user._id);
        dispatch({
            type: actions.SET_USER_BUSINESS,
            businessUsers: users,
            businessId: businessId
        });
    }
}

export function clearUserBusinessByPhoneForm() {
    return function (dispatch) {
        dispatch({
            type: actions.USER_BUSINESS_BY_PHONE_CLEAR,
        });
    };
}

export function deletePromotion(promotionId, businessId) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        dispatch({
            type: types.DELETE_PROMOTION,
            token: token,
            id: promotionId,
            businessId: businessId,
        });
    };
}

export function* setBusiness(createdBusiness) {
    yield put({
        type: actions.UPSERT_MY_BUSINESS_SINGLE,
        item: {business: createdBusiness}
    });
}

export function* setBusinessListener(createdBusiness) {
    yield put({
        type: actions.BUSINESS_LISTENER,
        id: createdBusiness._id
    });
    SyncerUtils.addMyBusinessSync(createdBusiness._id);
}

export default {
    getAll,
    updateBusinessPromotions
}
