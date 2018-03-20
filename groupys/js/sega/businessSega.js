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
import {handleSucsess}from './SegaSuccsesHandler'
let businessApi = new BusinessApi();

function* getAll(action) {
    try {
        const response = yield call(businessApi.getAll, action.token, true);
        handleSucsess();
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
        handleSucsess();
        if(createdBusiness._id) {
            createdBusiness.pictures = [];
            let pictures = [];
            if (action.business.image.path) {
                pictures.push(action.business.image.path);
                pictures.push(action.business.image.path);
                pictures.push(action.business.image.path);
                pictures.push(action.business.image.path);
                createdBusiness.pictures.push({pictures: pictures});
            } else {
                pictures.push(action.business.image.uri);
                pictures.push(action.business.image.uri);
                pictures.push(action.business.image.uri);
                pictures.push(action.business.image.uri);
                createdBusiness.pictures.push({pictures: pictures});
            }
            if (action.business.logoImage.path) {
                createdBusiness.logo = action.business.logoImage.path;
            } else {
                createdBusiness.logo = action.business.logoImage.uri;
            }
            createdBusiness.social_state = {};
            createdBusiness.social_state.saves = 0;
            createdBusiness.social_state.comments = 0;
            createdBusiness.social_state.likes = 0;
            createdBusiness.social_state.shares = 0;
            createdBusiness.social_state.realizes = 0;
            yield put(setBusiness(createdBusiness));
            if (action.business.image) {
                yield call(ImageApi.uploadImage, action.token, action.business.image, createdBusiness._id);
            }
            if (action.business.logoImage) {
                yield call(ImageApi.uploadImageLogo, action.token, action.business.logoImage, createdBusiness._id);
            }
            if (action.business.IdIdentifierImage) {
                yield call(ImageApi.uploadImagIdentificationCardr, action.token, action.business.IdIdentifierImage, createdBusiness._id);
            }
            if (action.business.LetterOfIncorporationImage) {
                yield call(ImageApi.uploadImagletter, action.token, action.business.LetterOfIncorporationImage, createdBusiness._id);
            }
        }
    } catch (error) {
        console.log("failed  updateBusiness")
    }
}

function* updateBusiness(action) {
    try {
        let updatedBusiness = yield call(businessApi.updateBusiness, action.business, action.token);
        handleSucsess();
        let pictures = [];
        let uploadCoverImage = false;
        let currentPicturePath = action.business.image.path;
        if (!currentPicturePath) {
            currentPicturePath = action.business.image.uri;
        }
        if (updatedBusiness.pictures[0].pictures[1] !== currentPicturePath) {
            uploadCoverImage = true;
            pictures.push(currentPicturePath);
            pictures.push(currentPicturePath);
            pictures.push(currentPicturePath);
            pictures.push(currentPicturePath);
            updatedBusiness.pictures.push({pictures: pictures});
        }

        if(!updatedBusiness.social_state){
            updatedBusiness.social_state = {};
            updatedBusiness.social_state.saves = 0;
            updatedBusiness.social_state.comments = 0;
            updatedBusiness.social_state.likes = 0;
            updatedBusiness.social_state.shares = 0;
            updatedBusiness.social_state.realizes = 0;
        }
        let uploadLogo = false;
        if (action.business.logoImage && updatedBusiness.logo !== action.business.logoImage) {
            uploadLogo = true;
            if (action.business.logoImage.path) {
                updatedBusiness.logo = action.business.logoImage.path;
            } else {
                updatedBusiness.logo = action.business.logoImage.uri;
            }
        }
        yield put(setBusiness(updatedBusiness));
        if (action.business.image && uploadCoverImage) {
            yield call(ImageApi.uploadImage, action.token, action.business.image, updatedBusiness._id);
        }
        if (action.business.logoImage && uploadLogo) {
            yield call(ImageApi.uploadImageLogo, action.token, action.business.logoImage, updatedBusiness._id);
        }
    } catch (error) {
        console.log("failed  updateBusiness")
    }
}

function* updateBusinessFirstTime(action) {
    try {
        yield put(businessLoading());
        const response = yield call(businessApi.getAll, action.token, true);
        handleSucsess();
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
        handleSucsess();
        const locale =  action.locale;
        let category = response[0].translations[locale];
        yield put(setBusinessCategory(category, action.business,));
    } catch (error) {
        console.log("failed  updateCategory")
    }
}

function* businessSega() {
    yield throttle(2000, segaActions.UPDATE_BUSINESS_REQUEST, getAll);
    yield throttle(2000, segaActions.UPDATE_BUSINESS_REQUEST_FIRST_TIME, updateBusinessFirstTime);
    yield throttle(2000, segaActions.SAVE_BUSINESS, saveBusiness);
    yield throttle(2000, segaActions.UPDATE_BUSINESS, updateBusiness);
    yield takeEvery(segaActions.UPDATE_BUSINESS_CATEGORY_REQUEST, updateCategory);
}

export default businessSega;