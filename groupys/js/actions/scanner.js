import BusinessApi from "../api/business";
import UserApi from "../api/user";
import PromotionApi from "../api/promotion";
import * as actions from "../reducers/reducerActions";

let userApi = new UserApi();
let businessApi = new BusinessApi();
let promotionApi = new PromotionApi();

export function scanResult(barcode, businessAssign) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            dispatch({type: actions.SCANNER_SHOW_CAMERA, cameraOn: false});

            if (businessAssign) {
                let data = JSON.parse(barcode.data);
                let response  = await businessApi.assihgnQrcCodeToBusinese(data,token,businessAssign);
                dispatch({
                    type: actions.SCANNER_SHOW_QRCODE_ASSIGMENT,
                });

                consolo.log('scann')
            }
            else {
                dispatch({type: actions.SCANNER_SHOW_SEARCH_SPIN, searching: true});
                let data = JSON.parse(barcode.data);
                if (!data.code) {
                    dispatch({
                        type: actions.NETWORK_IS_OFFLINE,
                    });
                    return;
                }
                dispatch({type: actions.SCANNER_CODE, code: data.code});
                if (barcode.type && barcode.type === 'QR_CODE') {
                    let response = await businessApi.searchBusinessByCode(data.code, token);
                    if (response && response.assignment && response.assignment.business) {
                        dispatch({type: actions.SCANNER_SHOW_BUSINESS, business: response.assignment.business})
                    } else {
                        let instance = await promotionApi.getPromotionInstance(data.code, token)
                        if (instance) {
                            console.log(instance);
                            let users = await userApi.getBusinessUsers(instance.instance.promotion.entity.business._id, token);
                            let isPermited = users.filter(permitedUser => {
                                return permitedUser.user._id === user._id
                            });
                            if (isPermited) {
                                dispatch({
                                    type: actions.SCANNER_SHOW_PROMOTION,
                                    instance: instance,
                                });
                            } else {
                                dispatch({
                                    type: actions.NETWORK_IS_OFFLINE,
                                });
                            }
                        } else {
                            dispatch({
                                type: actions.NETWORK_IS_OFFLINE,
                            });
                        }
                    }
                    dispatch({type: actions.SHOW_SEARCH_SPIN, searching: false})
                }
            }
        }
        catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

export function realizePromotion(code) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        try {
            dispatch({type: actions.SCANNER_RESET});
            await promotionApi.realizePromotion(code, token)
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

export function resetForm() {
    return function (dispatch) {
        dispatch({type: actions.SCANNER_RESET});
    }
}

export function followBusiness(businessId) {
    return async function (dispatch, getState) {
        try {
            dispatch({type: actions.SCANNER_RESET});
            const token = getState().authentication.token;
            await businessApi.followBusiness(businessId, token);
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

export function groupFollowBusiness(groupid, businessId) {
    return async function (dispatch, getState) {
        try {
            dispatch({type: actions.SCANNER_RESET});
            const token = getState().authentication.token;
            await businessApi.groupFollowBusiness(groupid, businessId, token);
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}
