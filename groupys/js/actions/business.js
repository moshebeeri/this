 /**
 * Created by roilandshut on 12/06/2017.
 */
import BusinessApi from "../api/business";
import UserApi from "../api/user";
import ProductApi from "../api/product";
import PromotionApi from "../api/promotion";
import * as actions from "../reducers/reducerActions";
import EntityUtils from "../utils/createEntity";

let businessApi = new BusinessApi();
let userApi = new UserApi();
let productApi = new ProductApi();
let promotionApi = new PromotionApi();
let entityUtils = new EntityUtils();

async function getAll(dispatch, token) {
    try {
        let response = await businessApi.getAll(token);
        if (response.length > 0) {
            dispatch({
                type: 'GET_BUSINESS',
                businesses: response,
            });
        }
    } catch (error) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
    }
}

async function getBusinessCategories(dispatch, gid, token) {
    try {
        let response = await businessApi.getBusinessCategories(gid, token);
        dispatch({
            type: actions.SET_BUSINESS_CATEGORIES,
            categories: response,
            language: 'en',
            catId: gid
        });
    } catch (error) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
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
    }
}

async function dispatchFollowByQrcode(dispatch, barcode, token) {
    try {
        dispatch({type: actions.SHOW_SEARCH_SPIN, searching: true});
        dispatch({type: actions.SHOW_CAMERA, cameraOn: false});
        if (barcode.type && barcode.type == 'QR_CODE') {
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
    }
}

export function searchBusiness(business) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        dispatchSearchBusiness(dispatch, business, token);
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
            businesses.forEach(function (business) {
                dispatch({
                    type: actions.UPSERT_MY_BUSINESS,
                    item: business
                });
            })
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
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
            selectedBusiness:business
        });
    }
}

export function followBusiness(bussinesId) {
    return function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            businessApi.followBusiness(bussinesId, token);
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

export function fetchBusinessCategories(gid) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        getBusinessCategories(dispatch, gid, token);
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
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
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
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

function saveBusinessFailed() {
    return  function (dispatch) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
    }
}

export function saveBusiness(business,navigation) {
    return async function (dispatch, getState) {
        try {
            dispatch({
                type: actions.SAVING_BUSINESS,
            });
            const token = getState().authentication.token;
            const user = getState().user.user;
            await entityUtils.create('businesses', business, token, undefined, undefined, user._id);
            let businesses = await businessApi.getAll(token);
            businesses.forEach(function (business) {
                dispatch({
                    type: actions.UPSERT_MY_BUSINESS,
                    item: business
                });
            })
            let selectedBusiness = businesses.filter(newBusiness => {
                newBusiness.business.name === business.name
            });
            dispatch({
                type: actions.SELECT_BUSINESS,
                selectedBusiness:selectedBusiness[0]
            });
            dispatch({
                type: actions.SAVING_BUSINESS_DONE,
            });
            navigation.goBack();

        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

export function updateBusiness(business,navigation) {
    return async function (dispatch, getState) {
        try {
            dispatch({
                type: actions.SAVING_BUSINESS,
            });
            const token = getState().authentication.token;
            await entityUtils.update('businesses', business, token, business._id);
            let businesses = await businessApi.getAll(token);
            businesses.forEach(function (business) {
                dispatch({
                    type: actions.UPSERT_MY_BUSINESS,
                    item: business
                });
            });

            dispatch({
                type: actions.SAVING_BUSINESS_DONE,
            });
            navigation.goBack();

        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}
