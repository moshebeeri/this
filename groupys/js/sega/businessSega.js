import {call, put, takeEvery, throttle} from 'redux-saga/effects'
import BusinessApi from "../api/business";
import {
    businessLoading,
    businessLoadingDone,
    setBusiness,
    setBusinessCategory,
    updateBusinesses
} from "../actions/business";
import * as segaActions from './segaActions'
import ImageApi from "../api/image";

let businessApi = new BusinessApi();

function* updateBusiness(action) {
    try {
        const response = yield call(businessApi.getAll, action.token, true);
        if (response.length > 0) {
            yield put(updateBusinesses(response))
        }
    } catch (error) {
        console.log("failed  updateBusiness")
    }
}

function* saveBusiness(action) {
    try {
        let createdBusiness = yield call(businessApi.createBusiness, action.business, action.token, true);
        createdBusiness.pictures = [];
        let pictures = [];
        if (action.business.image.path) {
            pictures.push(action.business.image.path);
            createdBusiness.pictures.push({pictures: pictures});
        } else {
            pictures.push(action.business.image.uri);
            createdBusiness.pictures.push({pictures: pictures});
        }
        if (action.business.logoImage.path) {
            createdBusiness.logo = action.business.logoImage.path;
        } else {
            createdBusiness.logo = action.business.logoImage.uri;
        }
        yield put(setBusiness(createdBusiness));
        if (action.business.image) {
            yield call(ImageApi.uploadImage, action.token, action.business.image, createdBusiness._id);
        }
        if (action.business.logoImage) {
            yield call(ImageApi.uploadImageLogo, action.token, action.business.logoImage, createdBusiness._id);
        }
        if (action.business.IdIdentifierImage) {
            yield call(ImageApi.uploadImage, action.token, action.business.IdIdentifierImage, createdBusiness._id);
        }
        if (action.business.LetterOfIncorporationImage) {
            yield call(ImageApi.uploadImage, action.token, action.business.LetterOfIncorporationImage, createdBusiness._id);
        }
    } catch (error) {
        console.log("failed  updateBusiness")
    }
}

function* updateBusinessFirstTime(action) {
    try {
        yield put(businessLoading());
        const response = yield call(businessApi.getAll, action.token, true);
        if (response.length > 0) {
            yield put(updateBusinesses(response));
        }
        yield put(businessLoadingDone());
    } catch (error) {
        yield put(businessLoadingDone());
        console.log("failed  updateBusinessFirstTime")
    }
}

function* updateCategory(action) {
    try {
        const response = yield call(businessApi.getSubCategory, action.token, action.business.business.subcategory, action.locale);
        yield put(setBusinessCategory(response, action.business));
    } catch (error) {
        console.log("failed  updateCategory")
    }
}

function* businessSega() {
    yield throttle(2000, segaActions.UPDATE_BUSINESS_REQUEST, updateBusiness);
    yield throttle(2000, segaActions.UPDATE_BUSINESS_REQUEST_FIRST_TIME, updateBusinessFirstTime);
    yield throttle(2000, segaActions.SAVE_BUSINESS, saveBusiness);
    yield takeEvery(segaActions.UPDATE_BUSINESS_CATEGORY_REQUEST, updateCategory);
}

export default businessSega;