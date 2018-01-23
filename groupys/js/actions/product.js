import ProdictApi from "../api/product";
import EntityUtils from "../utils/createEntity";
import * as actions from "../reducers/reducerActions";
import FormUtils from "../utils/fromUtils";
import ActionLogger from './ActionLogger'

let productApi = new ProdictApi();
let entityUtils = new EntityUtils();
let logger = new ActionLogger();

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
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
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
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
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
            await entityUtils.create('products', product, token);
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
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            logger.actionFailed('product-saveProduct')
        }
    }
}





