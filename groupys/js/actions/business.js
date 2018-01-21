/**
 * Created by roilandshut on 12/06/2017.
 */
import BusinessApi from "../api/business";
import UserApi from "../api/user";
import ProductApi from "../api/product";
import PricingApi from "../api/pricing";
import PromotionApi from "../api/promotion";
import * as actions from "../reducers/reducerActions";
import EntityUtils from "../utils/createEntity";
import FormUtils from "../utils/fromUtils";

const BTClient = require('react-native-braintree-xplat');
let businessApi = new BusinessApi();
let userApi = new UserApi();
let productApi = new ProductApi();
let promotionApi = new PromotionApi();
let entityUtils = new EntityUtils();
let pricingApi = new PricingApi();

import ActionLogger from './ActionLogger'
let logger = new ActionLogger();


async function getAll(dispatch, token) {
    try {
        let response = await businessApi.getAll(token);
        if (response.length > 0) {
            dispatch({
                type: actions.UPSERT_MY_BUSINESS,
                item: response
            });
        }
    } catch (error) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
        logger.actionFailed("business_getAll")
    }
}

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
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
        logger.actionFailed("business_get");
    }
}

async function getBusinessCategories(dispatch, gid, token) {
    try {
        let response = await businessApi.getBusinessCategories(gid, token);
        dispatch({
            type: actions.SET_BUSINESS_CATEGORIES,
            categories: response,
            language: FormUtils.getLocale(),
            catId: gid
        });
    } catch (error) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
        logger.actionFailed("business_get_Categories",gid);
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
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
        logger.actionFailed("business_search_business",business);
    }
}

async function dispatchFollowByQrcode(dispatch, barcode, token) {
    try {
        dispatch({type: actions.SHOW_SEARCH_SPIN, searching: true});
        dispatch({type: actions.SHOW_CAMERA, cameraOn: false});
        if (barcode.type && barcode.type === 'QR_CODE') {
            let data = JSON.parse(barcode.data);
            if (data.code) {
                let response = await businessApi.searchBusinessByCode(data.code, token);
                if (response && response.assignment && response.assignment.business) {
                    dispatch({type: actions.SEARCH_BUSINESS, businesses: [response.assignment.business]})
                } else {
                    dispatch({type: actions.SEARCH_BUSINESS, businesses: []})
                }
            }
        }
        dispatch({type: actions.SHOW_SEARCH_SPIN, searching: false})
    } catch (error) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
        logger.actionFailed("business_search_by_qrcode");
    }
}

export function searchBusiness(business) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        dispatchSearchBusiness(dispatch, business, token);
    }
}

export function showSearchForm(searchType,searchPlaceHolder) {
    return function (dispatch) {
        dispatch({type: actions.SEARCH_PARAMS, searchType: searchType,searchPlaceHolder:searchPlaceHolder})
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

export function onEndReached() {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        dispatch({
            type: actions.BUSSINESS_LOADING,
        });
        try {
            let businesses = await businessApi.getAll(token);
            dispatch({
                type: actions.UPSERT_MY_BUSINESS,
                item: businesses
            });
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            logger.actionFailed("business_getAll")
        }
        dispatch({
            type: actions.BUSSINESS_LOADING_DONE,
        });
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
            await businessApi.followBusiness(businessId, token);
            dispatch({type: actions.RESET_FOLLOW_FORM})

        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            logger.actionFailed("business_followBusiness",businessId)
        }
    }
}

export function unFollowBusiness(businessId) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            await businessApi.unFollowBusiness(businessId, token);
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            logger.actionFailed("business_followBusiness",businessId)
        }
    }
}

export function groupFollowBusiness(groupid, businessId, navigation) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            await businessApi.groupFollowBusiness(groupid, businessId, token);
            navigation.goBack();
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            logger.actionFailed("business_groupFollowBusiness",businessId)
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
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            logger.actionFailed("users_getBusinessUsers",businessId);
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
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            logger.actionFailed("product_findByBusinessId",businessId);
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
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            logger.actionFailed("promotion_findByBusinessId",businessId);
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
    }catch (error){
        logger.actionFailed("promotion_getAllByBusinessId",businessId);
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
            const user = getState().user.user;
            await entityUtils.create('businesses', business, token, undefined, undefined, user._id);
            let businesses = await businessApi.getAll(token);
            dispatch({
                type: actions.UPSERT_MY_BUSINESS,
                item: businesses
            });
            let selectedBusiness = businesses.filter(newBusiness => {
                newBusiness.business.name = business.name
            });
            dispatch({
                type: actions.SELECT_BUSINESS,
                selectedBusiness: selectedBusiness[0]
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
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            dispatch({
                type: actions.SAVING_BUSINESS_DONE,
            });
            logger.actionFailed("create_business",business);
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
            await entityUtils.update('businesses', business, token, business._id);
            let businesses = await businessApi.getAll(token);
            dispatch({
                type: actions.UPSERT_MY_BUSINESS,
                item: businesses
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
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            logger.actionFailed("update_business",business);
        }
    }
}

export function updateBusinesStatuss() {
    return async function (dispatch, getState) {
        try {

            const token = getState().authentication.token;
            let updatedBusiness = await businessApi.getAll(token);
            dispatch({
                type: actions.UPSERT_MY_BUSINESS,
                item: updatedBusiness
            });

        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            logger.actionFailed("update_business",business);
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
            let response = await businessApi.getBusinessQrCodeImage(business.qrcode, token);
            dispatch({
                type: actions.UPSERT_BUSINESS_QRCODE,
                business: business,
                qrcodeSource: response.qrcode
            });
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            logger.actionFailed("business_getBusinessQrCodeImage",business);
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
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
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
            if(!business.pricing) {
                await pricingApi.createBusinessPricing(business._id, token);
                let businesses = await businessApi.getAll(token);
                dispatch({
                    type: actions.UPSERT_MY_BUSINESS,
                    item: businesses
                });
            }

        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
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
export function resetForm() {
    return async function (dispatch) {
        dispatch({
            type: actions.SAVE_BUSINESS_TAMPLATE,
            templateBusiness: {},
        });
    }
}





export default {
    getAll,
    updateBusinessPromotions
}
