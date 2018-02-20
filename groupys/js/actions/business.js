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
import handler from './ErrorHandler'
import BusinessComperator from "../reduxComperators/BusinessComperator"
import * as errors from '../api/Errors'
import ActionLogger from './ActionLogger'
import * as types from '../sega/segaActions';

const BTClient = require('react-native-braintree-xplat');
let businessApi = new BusinessApi();
let userApi = new UserApi();
let productApi = new ProductApi();
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
        handler.handleError(error, dispatch, 'getBusinessCategories')
        logger.actionFailed("business_get_Categories", gid);
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
        logger.actionFailed("business_search_business", business);
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
        handler.handleError(error, dispatch, 'dispatchFollowByQrcode')
        logger.actionFailed("business_search_by_qrcode");
    }
}

export function searchUserBusinessesByPhoneNumber(phoneNumber, navigation) {
    return async function (dispatch,getState) {
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

            let {user, info} = await businessApi.getUserBusinessesByPhoneNumber(phoneNumber,token);
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
            handler.handleSuccses(getState(),dispatch);
            //navigation.goBack();
        } catch (error) {
            handler.handleError(error,dispatch,'UserBusinessesByPhoneNumber');
            logger.actionFailed('UserBusinessesByPhoneNumber');
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
            await businessApi.followBusiness(businessId, token);
            dispatch({type: actions.RESET_FOLLOW_FORM})
        } catch (error) {
            handler.handleError(error, dispatch, 'followBusiness')
            logger.actionFailed("business_followBusiness", businessId)
        }
    }
}

export function unFollowBusiness(businessId) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            await businessApi.unFollowBusiness(businessId, token);
        } catch (error) {
            handler.handleError(error, dispatch, 'unFollowBusiness')
            logger.actionFailed("business_followBusiness", businessId)
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
            handler.handleError(error, dispatch, 'groupFollowBusiness')
            logger.actionFailed("business_groupFollowBusiness", businessId)
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
            logger.actionFailed("users_getBusinessUsers", businessId);
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
            handler.handleError(error, dispatch, 'setBusinessProducts')
            logger.actionFailed("product_findByBusinessId", businessId);
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
            handler.handleError(error, dispatch, 'setBusinessPromotions')
            dispatch({
                type: actions.PROMOTION_LOADING_DONE,
                businessId: businessId
            });
            logger.actionFailed("promotion_findByBusinessId", businessId);
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
        logger.actionFailed("promotion_getAllByBusinessId", businessId);
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
            let createdBusiness = await entityUtils.create('businesses', business, token);
            createdBusiness.pictures = [];
            let pictures = [];
            if (business.image.path) {
                pictures.push(business.image.path);
                createdBusiness.pictures.push({pictures: pictures});
            } else {
                pictures.push(business.image.uri);
                createdBusiness.pictures.push({pictures: pictures});
            }
            if (business.logoImage.path) {
                createdBusiness.logo = business.logoImage.path;
            } else {
                createdBusiness.logo = business.logoImage.uri;
            }
            dispatch({
                type: actions.BUSINESS_UPLOAD_PIC,
                item: {itemResponse: createdBusiness, item: business}
            });
            dispatch({
                type: actions.UPSERT_MY_BUSINESS_SINGLE,
                item: {business: createdBusiness}
            });
            dispatch({
                type: actions.SELECT_BUSINESS,
                selectedBusiness: createdBusiness
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
            handler.handleError(error, dispatch, 'saveBusiness')
            dispatch({
                type: actions.SAVING_BUSINESS_DONE,
            });
            logger.actionFailed("create_business", business);
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
            let createdBusiness = await entityUtils.update('businesses', business, token, business._id);
            let businesses = await businessApi.getAll(token);
            let uploadPic = false;
            createdBusiness.pictures = [];
            let pictures = [];
            let coverPicsNumber = 0;
            if (createdBusiness.pictures) {
                coverPicsNumber = createdBusiness.pictures.length;
            }
            ;
            if (coverPicsNumber === 0 || ( createdBusiness.pictures[coverPicsNumber - 1].pictures[0].path !== business.image.uri || createdBusiness.pictures[coverPicsNumber - 1].pictures[0].path !== business.image.path)) {
                uploadPic = true;
                if (business.image.path) {
                    pictures.push(business.image.path);
                    createdBusiness.pictures.push({pictures: pictures});
                } else {
                    pictures.push(business.image.uri);
                    createdBusiness.pictures.push({pictures: pictures});
                }
            }
            if (business.logoImage && (!createdBusiness.logo || (createdBusiness.logo !== business.logoImage.path || createdBusiness.logo !== business.logoImage.uri ))) {
                uploadPic = true;
                if (business.logoImage.path) {
                    createdBusiness.logo = business.logoImage.path;
                } else {
                    createdBusiness.logo = business.logoImage.uri;
                }
            }
            if (uploadPic) {
                dispatch({
                    type: actions.BUSINESS_UPLOAD_PIC,
                    item: {businessResponse: createdBusiness, business: business}
                })
            }
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
            handler.handleError(error, dispatch, 'update_business')
            logger.actionFailed("update_business", business);
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
            handler.handleError(error, dispatch, 'setBusinessQrCode')
            logger.actionFailed("business_getBusinessQrCodeImage", business);
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

export function resetForm() {
    return async function (dispatch) {
        dispatch({
            type: actions.SAVE_BUSINESS_TAMPLATE,
            templateBusiness: {},
        });
    }
}

//////////// MOVE TO SEGA ACTIONS ////////////////////////////
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

export function updateBusinesses(response) {
    if (response.length > 0) {
        if (businessComperator.shouldUpdateBusinesses(response)) {
            return {
                type: actions.UPSERT_MY_BUSINESS,
                item: response
            }
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
            business:item,
            locale:locale
        })
    }
}

export function clearUserBusinessByPhoneForm() {
    return function (dispatch) {
        dispatch({
            type: actions.USER_BUSINESS_BY_PHONE_CLEAR,
        });
    };
}

export default {
    getAll,
    updateBusinessPromotions
}
