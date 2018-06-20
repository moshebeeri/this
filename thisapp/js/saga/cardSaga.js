import {call, put, throttle} from 'redux-saga/effects'
import cardApi from "../api/card";
import {setCard} from "../actions/cardAction";
import * as sagaActions from './sagaActions'
import ImageApi from "../api/image";
import {handleSucsess} from './SagaSuccsesHandler'
import * as actions from '../reducers/reducerActions';

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


function* getBusinessCards(action) {
    try {
        let cards = yield call(cardApi.getCardType,  action.businessId, action.token);
        console.log(cards);
        if(cards.length > 0 ) {
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
        if(businessCard.pictures.length > 0){
            currentCardImage = businessCard.pictures[businessCard.pictures.length - 1].pictures[1];
        }
        if(action.card.coverImage && (!currentCardImage || action.card.coverImage.path !== currentCardImage ) ) {
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
        let memberCards = yield call(cardApi.getMyMemberCards,  action.token);
        console.log(memberCards);
        if(memberCards.length > 0 ) {
            yield put({
                type: actions.SET_MY_MEMBER_CARDS,
                memberCards: memberCards
            })
        }
    } catch (error) {
        console.log("failed  create card");
    }
}


function* cardSage() {
    yield throttle(2000, sagaActions.SAVE_CARD, createCard);
    yield throttle(2000, sagaActions.UPDATE_CARD, updateCard);
    yield throttle(2000, sagaActions.GET_BUSINESS_CARD, getBusinessCards);
    yield throttle(2000, sagaActions.GET_MY_MEMBER_CARDS, getMyMemverCards);
  //  yield throttle(2000, sagaActions.UPDATE_CARD, updateCard);
}

export default cardSage;