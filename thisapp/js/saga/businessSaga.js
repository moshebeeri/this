import {call, put, takeEvery, throttle} from 'redux-saga/effects'
import BusinessApi from "../api/business";
import productApi from "../api/product";
import PromotionApi from "../api/promotion";
import UserApi from "../api/user";
import {
    businessLoading,
    businessLoadingDone,
    setBusiness,
    setBusinessCategory,
    updateBusinesses,
    setBusinessListener,
    updateBusinessesListeners,
    updateBusinessesProducts,
    updateBusinessesPromotions,
    updateBusinessesUsers
} from "../actions/business";
import * as sagaActions from './sagaActions'
import ImageApi from "../api/image";
import {handleSucsess} from './SagaSuccsesHandler'
import * as actions from '../reducers/reducerActions'

let businessApi = new BusinessApi();
let promotionApi = new PromotionApi();
let userApi = new UserApi();

function* getAll(action) {
    try {
        const response = yield call(businessApi.getAll, action.token, true);
        handleSucsess();
        yield* updateBusinesses(response);
        if (response.length > 0) {
            yield* updateBusinessesListeners(response);
        }
    } catch (error) {
        console.log("failed  updateBusiness")
    }
}

function* getBusinessProducts(action) {
    try {
        const response = yield call(productApi.findByBusinessId,action.businessId, action.token);
        handleSucsess();
        if (response.length > 0) {
            yield* updateBusinessesProducts(response,action.businessId);
        }
    } catch (error) {
        console.log("failed  getBusinessProducts ")
    }
}

function* getBusinessPromotions(action) {
    try {
        const response = yield call(promotionApi.getAllByBusinessId,action.businessId, action.token);
        handleSucsess();
        if (response.length > 0) {
            yield* updateBusinessesPromotions(response,action.businessId);
        }
    } catch (error) {
        console.log("failed  getBusinessPromotions ")
    }
}
function* getBusinessUsers(action) {
    try {

        const response = yield call(userApi.getBusinessUsers,action.businessId, action.token);
        handleSucsess();
        if (response.length > 0) {
            yield* updateBusinessesUsers(response,action.businessId);
        }
    } catch (error) {
        console.log("failed  getBusinessUsers ")
    }
}


function* saveBusiness(action) {
    try {
        let createdBusiness = yield call(businessApi.createBusiness, action.business, action.token, true);
        handleSucsess();
        if (createdBusiness._id) {
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
            yield* setBusiness(createdBusiness);
            yield* setBusinessListener(createdBusiness);
            if (action.business.image && !action.business.image.inServer) {
                yield call(ImageApi.uploadImage, action.token, action.business.image, createdBusiness._id);
            }else{
                yield call(businessApi.updatePicturess,createdBusiness._id, createdBusiness.pictures, action.token);
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
        if (updatedBusiness.pictures.length > 0 && updatedBusiness.pictures[0].pictures[1] !== currentPicturePath) {
            uploadCoverImage = true;
            pictures.push(currentPicturePath);
            pictures.push(currentPicturePath);
            pictures.push(currentPicturePath);
            pictures.push(currentPicturePath);
            updatedBusiness.pictures.push({pictures: pictures});
        }else{
            uploadCoverImage = true;
            pictures.push(currentPicturePath);
            pictures.push(currentPicturePath);
            pictures.push(currentPicturePath);
            pictures.push(currentPicturePath);
            updatedBusiness.pictures.push({pictures: pictures});
        }
        if (!updatedBusiness.social_state) {
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
        yield* setBusiness(updatedBusiness);
        if(uploadCoverImage) {
            if (action.business.image && !action.business.image.inServer) {
                yield call(ImageApi.uploadImage, action.token, action.business.image, updatedBusiness._id);
            } else {
                yield call(businessApi.updatePicturess,updatedBusiness._id,  updatedBusiness.pictures, action.token);
            }
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
            yield* updateBusinesses(response);
            yield* updateBusinessesListeners(response);
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
        const locale = action.locale;
        let category = response[0].translations[locale];
        yield put(setBusinessCategory(category, action.business,));
    } catch (error) {
        console.log("failed  updateCategory")
    }
}


function* getNextBusinessFollowers(action) {
    try {
        let followers = yield call(businessApi.getBusinessFollowers ,action.businessId, action.token,action.skip, action.limit);
        console.log(followers)
        if(followers && followers.length > 0) {
            yield put({
                type: actions.SET_BUSINESS_FOLLOWERS,
                followers: followers,
                businessId: action.businessId
            })
        }
    } catch (error) {
        console.log("failed  getNextBusinessFollowers " + error);
    }
}

function* businessSaga() {
    yield throttle(2000, sagaActions.UPDATE_BUSINESS_REQUEST, getAll);
    yield throttle(2000, sagaActions.UPDATE_BUSINESS_PRODUCTS, getBusinessProducts);
    yield throttle(2000, sagaActions.UPDATE_BUSINESS_PROMOTIONS, getBusinessPromotions);
    yield throttle(2000, sagaActions.UPDATE_BUSINESS_PERMISSIONS, getBusinessUsers);
    yield throttle(2000, sagaActions.UPDATE_BUSINESS_REQUEST_FIRST_TIME, updateBusinessFirstTime);
    yield throttle(2000, sagaActions.SAVE_BUSINESS, saveBusiness);
    yield throttle(2000, sagaActions.UPDATE_BUSINESS, updateBusiness);
    yield takeEvery(sagaActions.UPDATE_BUSINESS_CATEGORY_REQUEST, updateCategory);
    yield takeEvery(sagaActions.UPDATE_BUSINESS_FOLLOWERS, getNextBusinessFollowers);
}

export default businessSaga;