import ProdictApi from "../api/product";
import EntityUtils from "../utils/createEntity";
import * as actions from "../reducers/reducerActions";
import FormUtils from "../utils/fromUtils";
import ActionLogger from './ActionLogger'

let productApi = new ProdictApi();
let entityUtils = new EntityUtils();
let logger = new ActionLogger();
import  handler from './ErrorHandler'

async function getAllByBusinessId(dispatch, id, token) {
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
        handler.handleError(error,dispatch)
        logger.actionFailed('product-getAllByBusinessId')
    }
}

async function getProductCategories(dispatch, gid, token) {
    try {
        if (gid) {
            let response = await productApi.getProductCategories(gid, token);
            if (response) {
                dispatch({
                    type: actions.SET_PRODUCT_CATEGORIES,
                    categories: response,
                    language: FormUtils.getLocale(),
                    catId: gid
                });
            }
        }
    } catch (error) {
        handler.handleError(error,dispatch)
        logger.actionFailed('product-getProductCategories')
    }
}

export function fetchProducts() {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        getAll(dispatch, token);

    }
}

export function fetchProductsByBusiness(businessId) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        getAllByBusinessId(dispatch, businessId, token);
    }
}

export function setProductCategories(gid) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        getProductCategories(dispatch, gid, token);
    }
}
export function resetForm() {
    return function (dispatch) {
        dispatch({
            type: actions.PRODUCT_RESET_FORM,
        });

    }
}




export function saveProduct(product,businessId,navigation) {
    return async function (dispatch, getState) {
        try {
            dispatch({
                type: actions.PRODUCT_SAVING,
            });
            const token = getState().authentication.token;
            let response = await entityUtils.create('products', product, token);
            entityUtils.uploadPicture('products', product, token,response)
            let products = await productApi.findByBusinessId(businessId, token);
            dispatch({
                type: actions.SET_PRODUCT_BUSINESS,
                businessProducts: products,
                businessId: businessId
            });

            dispatch({
                type: actions.PRODUCT_SAVING_DONE,
            });
            navigation.goBack();
            handler.handleSuccses(getState(),dispatch)
        } catch (error) {
            handler.handleError(error,dispatch)
            logger.actionFailed('product-saveProduct')
        }
    }
}





