import * as actions from "../reducers/reducerActions";
import ActionLogger from './ActionLogger'
import handler from './ErrorHandler'
import * as types from '../saga/sagaActions';
import SyncerUtils from "../sync/SyncerUtils";

let logger = new ActionLogger();

export function saveCard(card, businessId, navigation) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            dispatch({
                type: types.SAVE_CARD,
                card: card,
                businessId: businessId,
                token: token
            });
            navigation.goBack();
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch)
            await logger.actionFailed('product-saveCard')
        }
    }
}


export function updateCard(card, businessId, navigation) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            dispatch({
                type: types.UPDATE_CARD,
                card: card,
                businessId: businessId,
                token: token
            });
            navigation.goBack();
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch)
            await logger.actionFailed('product-saveCard')
        }
    }
}


export function setCardQrcCode(card) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            dispatch({
                type: types.GET_CARD_QRCODE,
                card: card,
                token: token
            });
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch)
            await logger.actionFailed('product-saveCard')
        }
    }
}



export function setBusinessCards(businessId) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            dispatch({
                type: types.GET_BUSINESS_CARD,
                businessId: businessId,
                token: token
            });
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch)
            await logger.actionFailed('product-saveCard')
        }
    }
}



export function setMyCards() {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            dispatch({
                type: types.GET_MY_MEMBER_CARDS,
                token: token
            });
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch)
            await logger.actionFailed('product-saveCard')
        }
    }
}

export function setCard(response, businessId) {
    return {
        type: actions.SET_BUSINESS_CARD,
        card: response,
        businessId: businessId,
    }
}

export function syncProductChange(businessId) {
    SyncerUtils.invokeBusinessProductsChange(businessId);
}






