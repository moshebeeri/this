import {call, put, takeEvery, throttle} from 'redux-saga/effects'
import cardApi from "../api/card";
import UserApi from "../api/user";
import {setCard} from "../actions/cardAction";
import * as sagaActions from './sagaActions'
import ImageApi from "../api/image";
import * as actions from '../reducers/reducerActions';

const userApi = new UserApi();

function* createCard(action) {
    try {
        let tempCard = action.card;
        // Workaround default product categories
        if (action.card.coverImage) {
            let imageResponse = yield call(ImageApi.uploadImage, action.token, action.card.coverImage, 'image');
            tempCard.pictures = imageResponse.pictures;
        }
        let createdCard = yield call(cardApi.createCardType, tempCard, action.token);
        yield put(setCard(createdCard, action.businessId));
    } catch (error) {
        console.log("failed  create card");
    }
}

function* getBusinessCards(action) {
    try {
        let cards = yield call(cardApi.getCardType, action.businessId, action.token);
        console.log(cards);
        if (cards.length > 0) {
            yield put(setCard(cards[0], action.businessId));
        }
    } catch (error) {
        console.log("failed  create card");
    }
}

function* updateCard(action) {
    try {
        let businessCard = action.card;
        let currentCardImage = undefined;
        if (businessCard.pictures.length > 0) {
            currentCardImage = businessCard.pictures[businessCard.pictures.length - 1].pictures[1];
        }
        if (action.card.coverImage && (!currentCardImage || action.card.coverImage.path !== currentCardImage )) {
            let imageResponse = yield call(ImageApi.uploadImage, action.token, action.card.coverImage, 'image');
            businessCard.pictures = imageResponse.pictures;
        }
        let updatedCard = yield call(cardApi.updateCardType, businessCard, action.token);
        yield put(setCard(updatedCard, action.businessId));
    } catch (error) {
        console.log("failed  create card");
    }
}

function* getMyMemverCards(action) {
    try {
        let memberCards = yield call(cardApi.getMyMemberCards, action.token);
        if (memberCards.length > 0) {
            yield put({
                type: actions.SET_MY_MEMBER_CARDS,
                memberCards: memberCards
            })
            yield put({
                type: actions.SYNC_CARD,
                memberCards: memberCards
            })
        }
    } catch (error) {
        console.log("failed  create card");
    }
}

function* getCardChargeQrCode(action) {
    try {
        let qrCode = yield call(cardApi.getCardChargeQrCode, action.card._id, action.token);
        console.log(qrCode);
        yield put({
            type: actions.SET_CARD_QRCODE,
            qrCode: qrCode,
            cardId: action.card._id
        })
    } catch (error) {
        console.log("failed  create card");
    }
}

function* chargeCardByCode(action) {
    try {
        yield call(cardApi.chargeCardeByCode, action.code, action.points, action.token);
    } catch (error) {
        console.log("failed  create card");
    }
}

function* getCardByCode(action) {
    try {
        let card = yield call(cardApi.getCardByCode, action.code, action.token);
        yield put({
            type: actions.SCANNER_SHOW_USER_CARD,
            card: card,
            code: action.code,
        })
    } catch (error) {
        console.log("failed  create card");
    }
}

function* searchUser(action) {
    try {
        let users = yield call(userApi.searcUser, action.searchString, action.token);
        yield put({
            type: actions.CARD_RESET,
        })
        yield put({
            type: actions.CARD_SET_POTENTIAL_USERS,
            users: users,
        })
    } catch (error) {
        console.log("failed  create card");
    }
}

function* inviteUser(action) {
    try {
        if(!action.card._id) {
            let createdCard = action.card;
            if (action.card.coverImage) {
                let imageResponse = yield call(ImageApi.uploadImage, action.token, action.card.coverImage, 'image');
                createdCard.pictures = imageResponse.pictures;
            }
            createdCard = yield call(cardApi.createCardType, createdCard, action.token);
            yield call(cardApi.inviteUser, createdCard, action.user, action.token);
            yield put(setCard(createdCard, action.businessId));
        } else {
            yield call(cardApi.inviteUser, action.card, action.user, action.token);
        }
        yield put({
            type: actions.CARD_RESET,
        })
    } catch (error) {
        yield put({
            type: actions.CARD_USER_ALREADY_INVITED,
        })
        console.log("failed invite user")
    }
}

function* acceptCardInvite(action) {
    try {
        yield call(cardApi.acceptInvatation, action.card, action.token);
    } catch (error) {
        console.log("failed invite user")
    }
}

function* cardSage() {
    yield throttle(2000, sagaActions.SAVE_CARD, createCard);
    yield throttle(2000, sagaActions.UPDATE_CARD, updateCard);
    yield takeEvery(sagaActions.GET_BUSINESS_CARD, getBusinessCards);
    yield throttle(2000, sagaActions.GET_MY_MEMBER_CARDS, getMyMemverCards);
    yield throttle(2000, sagaActions.CARD_INVITE_USER, inviteUser);
    yield throttle(2000, sagaActions.CARD_SEARCH_USER, searchUser);
    yield throttle(2000, sagaActions.CARD_ACCEPT_INVITE, acceptCardInvite);
    yield throttle(2000, sagaActions.GET_CARD_QRCODE, getCardChargeQrCode);
    yield throttle(2000, sagaActions.CHARGE_CARD_BY_CODE, chargeCardByCode);
    yield throttle(2000, sagaActions.SCANNER_SHOW_CHARGE, getCardByCode);
    //  yield throttle(2000, sagaActions.UPDATE_CARD, updateCard);
}

export default cardSage;