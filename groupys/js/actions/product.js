import ProdictApi from "../api/product";
import EntityUtils from "../utils/createEntity";
import * as actions from "../reducers/reducerActions";

let productApi = new ProdictApi();
let entityUtils = new EntityUtils();

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
                    language: 'en',
                    catId: gid
                });
            }
        }
    } catch (error) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
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

export function saveProduct(product, saveSucsees, saveFailed) {
    return function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            entityUtils.create('products', product, token, saveSucsees, saveFailed, user._id);
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

export function updateProduct(product, saveSucsees, saveFailed, itemId) {
    return function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            entityUtils.update('products', product, token, saveSucsees, saveFailed, itemId);
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}




