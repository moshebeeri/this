import {call, put, throttle} from 'redux-saga/effects'
import cardApi from "../api/card";
import {setCard} from "../actions/cardAction";
import * as sagaActions from './sagaActions'
import ImageApi from "../api/image";
import {handleSucsess} from './SagaSuccsesHandler'

function* createCard(action) {
    try {
        let tempCard = action.card;
        // Workaround default product categories
        if(action.card.coverImage) {
            let imageResponse = yield call(ImageApi.uploadImage, action.token, action.card.coverImage, 'image');
            tempCard.pictures = imageResponse.pictures;
        }
        let createdCard = yield call(cardApi.createCardType, tempCard, action.token);
        yield put(setCard(createdCard, action.businessId));
    } catch (error) {
        console.log("failed  create card");
    }
}

function* updateCard(action) {
    try {
        let updatedProduct = yield call(productApi.updateProduct, action.product, action.token);
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


function* cardSage() {
    yield throttle(2000, sagaActions.SAVE_CARD, createCard);
  //  yield throttle(2000, sagaActions.UPDATE_CARD, updateCard);
}

export default cardSage;