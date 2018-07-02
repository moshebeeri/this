import {call, put, throttle} from 'redux-saga/effects'
import productApi from "../api/product";
import {removeProduct, setProduct, syncProductChange} from "../actions/product";
import * as sagaActions from './sagaActions'
import ImageApi from "../api/image";
import {handleSucsess} from './SagaSuccsesHandler'

function* saveProduct(action) {
    try {
        let temProduct = action.product;
        // Workaround default product categories
        temProduct.category = [247183, 247467];
        temProduct._id = 'temp_product' + +new Date().getTime();
        temProduct.pictures = [];
        let pictures = [];
        if (action.product.image.path) {
            pictures.push(action.product.image.path);
            pictures.push(action.product.image.path);
            pictures.push(action.product.image.path);
            pictures.push(action.product.image.path);
            temProduct.pictures.push({pictures: pictures});
        } else {
            pictures.push(action.product.image.uri);
            pictures.push(action.product.image.uri);
            pictures.push(action.product.image.uri);
            pictures.push(action.product.image.uri);
            temProduct.pictures.push({pictures: pictures});
        }
        yield put(setProduct(temProduct, action.businessId));
        let imageResponse = yield call(ImageApi.uploadImage, action.token, action.product.image, 'image');
        temProduct.pictures = imageResponse.pictures;
        let tempId = temProduct._id
        temProduct._id = undefined;
        let createdProduct = yield call(productApi.createProduct, temProduct, action.token);
        yield put(setProduct(createdProduct, action.businessId, tempId));
        syncProductChange(action.businessId);
    } catch (error) {
        console.log("failed  updateProductn");
    }
}

function* updateProduct(action) {
    try {
        let product = action.product;
        product.category = [247183, 247467];
        let updatedProduct = yield call(productApi.updateProduct, product, action.token);
        handleSucsess();
        let pictures = [];
        let uploadCoverImage = false;
        let currentPicturePath = action.product.image.path;
        if (!currentPicturePath) {
            currentPicturePath = action.product.image.uri;
        }
        if (updatedProduct.pictures.length > 0 && updatedProduct.pictures[updatedProduct.pictures.length - 1].pictures[1] !== currentPicturePath) {
            uploadCoverImage = true;
            pictures.push(currentPicturePath);
            pictures.push(currentPicturePath);
            pictures.push(currentPicturePath);
            pictures.push(currentPicturePath);
            updatedProduct.pictures.push({pictures: pictures});
        } else {
            uploadCoverImage = true;
            pictures.push(currentPicturePath);
            pictures.push(currentPicturePath);
            pictures.push(currentPicturePath);
            pictures.push(currentPicturePath);
            updatedProduct.pictures.push({pictures: pictures});
        }
        yield put(setProduct(updatedProduct, action.businessId));
        if (uploadCoverImage) {
            yield call(ImageApi.uploadImage, action.token, action.product.image, updatedProduct._id);
        }
    } catch (error) {
        console.log("failed  updateBusiness")
    }
}

function* deleteProduct(action) {
    try {
        yield call(productApi.deleteProduct, action.product, action.token);
        yield put(removeProduct(action.businessId, action.product._id));
        syncProductChange(action.businessId);
    } catch (error) {
        console.log("failed  deleteProduct")
    }
}

function* productSaga() {
    yield throttle(2000, sagaActions.SAVE_PRODUCT, saveProduct);
    yield throttle(2000, sagaActions.UPDATE_PRODUCT, updateProduct);
    yield throttle(2000, sagaActions.DELETE_PRODUCT, deleteProduct);
}

export default productSaga;