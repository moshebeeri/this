import BusinessApi from "../api/business";
import GroupApi from "../api/groups";
import UserApi from "../api/user";
import PromotionApi from "../api/promotion";
import * as actions from "../reducers/reducerActions";
import ActionLogger from './ActionLogger'
import * as errors from '../api/Errors'
import handler from './ErrorHandler'
import SyncUtils from "../sync/SyncerUtils";
import * as types from '../saga/sagaActions';
let userApi = new UserApi();
let businessApi = new BusinessApi();
let groupApi = new GroupApi();
let promotionApi = new PromotionApi();
let logger = new ActionLogger();

export function scanResult(barcode, businessAssign) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            dispatch({type: actions.SCANNER_SHOW_CAMERA, cameraOn: false});
            let data = JSON.parse(barcode.data);
            if(data.opt ==='charge'){
                dispatch({
                    type: types.SCANNER_SHOW_CHARGE,
                    code: data.code
                });
                return;
            }
            if (businessAssign) {

                try {
                    let response = await businessApi.assihgnQrcCodeToBusinese(data, token, businessAssign);
                    dispatch({
                        type: actions.SCANNER_SHOW_QRCODE_ASSIGMENT,
                    });
                    return;
                } catch (error) {
                    dispatch({
                        type: actions.SCANNER_SHOW_QRCODE_ASSIGMEN_FAILED,
                    });
                    return;
                }
            }
            dispatch({type: actions.SCANNER_SHOW_SEARCH_SPIN, searching: true});
            if (!data.code) {
                dispatch({
                    type: actions.SCANNER_SHOW_QRCODE_ASSIGMEN_FAILED,
                });
                return;
            }
            dispatch({type: actions.SCANNER_CODE, code: data.code});
            if (barcode.type && barcode.type === 'QR_CODE') {
                let response = await businessApi.searchBusinessByCode(data.code, token);
                if (response && response.assignment && response.assignment.group) {
                    dispatch({type: actions.SCANNER_SHOW_GROUP, group: response.assignment.group})
                } else {
                    if (response && response.assignment && response.assignment.business) {
                        dispatch({type: actions.SCANNER_SHOW_BUSINESS, business: response.assignment.business})
                    } else {
                        let instance = await promotionApi.getPromotionInstance(data.code, token)
                        if (instance) {
                            let intime = inTime(instance);
                            if (!intime) {
                                dispatch({
                                    type: actions.SCANNER_CONDITION_OUT_OF_SCOPE,
                                });
                                return;
                            }
                            let users = await userApi.getBusinessUsers(instance.instance.promotion.entity.business._id, token);
                            let isPermited = users.filter(permitedUser => {
                                return permitedUser.user._id === user._id
                            });
                            if (isPermited) {
                                dispatch({
                                    type: actions.SCANNER_SHOW_PROMOTION,
                                    instance: instance,
                                });
                            }
                        }
                    }
                }
                dispatch({type: actions.SCANNER_SHOW_SEARCH_SPIN, searching: false})
            }
            handler.handleSuccses(getState(), dispatch)
        }
        catch (error) {
            dispatch({type: actions.SCANNER_SHOW_SEARCH_SPIN, searching: false})
            if (error && (error === errors.REALIZATIOn_NOT_ALLOWED)) {
                dispatch({
                    type: actions.SCANNER_SHOW_NOT_AUTHOTIZED,
                });
            }
            if (error) {
                handler.handleError(error, dispatch, 'scanner-scanResult')
            }
            await logger.actionFailed('scanner-scanResult')
        }
    }
}

export function inTime(instance) {
    let date = new Date();
    if (instance.type === 'HAPPY_HOUR') {
        return isIn(instance.savedData.happy_hour.days, instance.savedData.happy_hour.from, instance.savedData.happy_hour.until,
            date.getDay() + 1, date.getHours(), date.getMinutes());
    }
    return true;
}

export function isIn(days,
                     from,
                     until,
                     day,
                     hours,
                     minutes) {
    var now_seconds = hours * 60 * 60 + minutes * 60;
    if (days.includes(day) && ( from <= now_seconds && now_seconds <=   until ) )
        return true;
    if (days.includes(day - 1)) {
        now_seconds = (24 + hours) * 60 * 60 + minutes * 60;
        if (from <= now_seconds && now_seconds <=   until)
            return true;
    }
    return false;
}

export function realizePromotion(code) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        try {
            dispatch({type: actions.SCANNER_RESET});
            let response = await promotionApi.realizePromotion(code, token);
            SyncUtils.invokePromotionSocialChange(response.savedInstance.instance.promotion._id);
            console.log(response)
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'scanner-realizePromotion')
            await logger.actionFailed('scanner-realizePromotion')
        }
    }
}

export function resetForm() {
    return function (dispatch) {
        dispatch({type: actions.SCANNER_RESET});
    }
}
export function closeCamera() {
    return function (dispatch) {
        dispatch({type: actions.SCANNER_SHOW_CAMERA,cameraOn:false});
    }
}



export function followBusiness(businessId) {
    return async function (dispatch, getState) {
        try {
            dispatch({type: actions.SCANNER_RESET});
            const token = getState().authentication.token;
            const user = getState().user.user;
            const feedOrder = getState().feeds.feedView;
            await businessApi.followBusiness(businessId, token);
            // start listen for feeds
            dispatch({
                type: types.CANCEL_MAIN_FEED_LISTENER,
            });
            if (feedOrder && feedOrder.length > 0) {
                dispatch({
                    type: types.LISTEN_FOR_MAIN_FEED,
                    id: feedOrder[0],
                    token: token,
                    user: user,
                });
            }
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'scanner-followBusiness')
            await logger.actionFailed('scanner-followBusiness')
        }
    }
}

export function groupFollowBusiness(groupid, businessId) {
    return async function (dispatch, getState) {
        try {
            dispatch({type: actions.SCANNER_RESET});
            const token = getState().authentication.token;
            await businessApi.groupFollowBusiness(groupid, businessId, token);
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'scanner-groupFollowBusiness')
            await logger.actionFailed('scanner-groupFollowBusiness')
        }
    }

}

export function followGroupAction(group) {
    return async function (dispatch, getState) {
        try {
            dispatch({type: actions.SCANNER_RESET});
            const token = getState().authentication.token;
            const user = getState().user.user;
            await groupApi.addUserToGroup(user._id,group._id,token)
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'scanner-groupFollowBusiness')
            await logger.actionFailed('scanner-groupFollowBusiness')
        }
    }

}


