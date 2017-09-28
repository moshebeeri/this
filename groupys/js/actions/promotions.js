import PromotionsApi from "../api/promotion";
import ProductApi from "../api/product";
let promotionApi = new PromotionsApi();
let productApi = new ProductApi();
async function getAll(dispatch, id, token) {
    try {
        let response = await promotionApi.getAllByBusinessId(id, token);
        if (response.length > 0) {
            dispatch({
                type: 'GET_PROMOTIONS',
                promotions: response,
                businessId: id
            });
        }
    } catch (error) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
    }
}
async function getAllProducts(dispatch, id, token) {
    try {
        let response = await productApi.findByBusinessId(id, token);
        if (response.length > 0) {
            dispatch({
                type: 'GET_BUSINESS_PRODUCTS',
                products: response,
                businessId: id
            });
        }
    } catch (error) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
    }
}
export function fetchPromotions(id) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        getAll(dispatch, id, token);
    }
}
export function fetchProducts(id) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        getAllProducts(dispatch, id, token);
    }
}