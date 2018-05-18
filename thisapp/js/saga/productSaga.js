import {call, put, throttle} from 'redux-saga/effects'
import productApi from "../api/product";
import {setProduct,syncProductChange} from "../actions/product";
import * as sagaActions from './sagaActions'
import ImageApi from "../api/image";
import {handleSucsess}from './SagaSuccsesHandler'


function* saveProduct(action) {
    try {
        let temProduct = action.product;
        // Workaround default product categories
        temProduct.category = [247183, 247467];
        temProduct._id = 'temp_product' +  + new Date().getTime();
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
        yield put(setProduct(createdProduct, action.businessId,tempId));
        syncProductChange(action.businessId);



    } catch (error) {
        console.log("failed  updateProductn");
    }
}

function* productSaga() {
    yield throttle(2000, sagaActions.SAVE_PRODUCT, saveProduct);
}

export default productSaga;