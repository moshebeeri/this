import BusinessApi from "../api/business";
import UserApi from "../api/user";
import PromotionApi from "../api/promotion";
import * as actions from "../reducers/reducerActions";
import ActionLogger from './ActionLogger'

let userApi = new UserApi();
let businessApi = new BusinessApi();
let promotionApi = new PromotionApi();
let logger = new ActionLogger();
import  handler from './ErrorHandler'

export function scanResult(barcode, businessAssign) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            dispatch({type: actions.SCANNER_SHOW_CAMERA, cameraOn: false});
            if (businessAssign) {
                let data = JSON.parse(barcode.data);
                try {
                    let response = await businessApi.assihgnQrcCodeToBusinese(data, token, businessAssign);
                    dispatch({
                        type: actions.SCANNER_SHOW_QRCODE_ASSIGMENT,
                    });
                    return;
                }catch (error){
                    dispatch({
                        type: actions.SCANNER_SHOW_QRCODE_ASSIGMEN_FAILED,
                    });
                    return;

                }
            }
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
        catch (error) {
            handler.handleError(error,dispatch)
            logger.actionFailed('scanner-scanResult')
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
            handler.handleError(error,dispatch)
            logger.actionFailed('scanner-realizePromotion')
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
            handler.handleError(error,dispatch)
            logger.actionFailed('scanner-followBusiness')
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
            handler.handleError(error,dispatch)
            logger.actionFailed('scanner-groupFollowBusiness')
        }
    }
}
