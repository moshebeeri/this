import {call, put, throttle} from 'redux-saga/effects'
import productApi from "../api/product";
import {setProduct} from "../actions/product";
import * as segaActions from './segaActions'
import ImageApi from "../api/image";


function* saveProduct(action) {
    try {
        let createdProduct = yield call(productApi.createProduct, action.product, action.token);

        createdProduct.pictures = [];
        let pictures = [];
        if (action.product.image.path) {
            pictures.push(action.product.image.path);
            pictures.push(action.product.image.path);
            pictures.push(action.product.image.path);
            pictures.push(action.product.image.path);
            createdProduct.pictures.push({pictures: pictures});
        } else {
            pictures.push(action.product.image.uri);
            pictures.push(action.product.image.uri);
            pictures.push(action.product.image.uri);
            pictures.push(action.product.image.uri);
            createdProduct.pictures.push({pictures: pictures});
        }
        yield put(setProduct(createdProduct, action.businessId));
        if (action.product.image) {
            yield call(ImageApi.uploadImage, action.token, action.product.image, createdProduct._id);
        }
    } catch (error) {
        console.log("failed  updateProductn");
    }
}

function* productSega() {
    yield throttle(2000, segaActions.SAVE_PRODUCT, saveProduct);
}

export default productSega;