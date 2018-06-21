const initialState = {memberCards: [], update: false};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";
export default function memberCards(state = initialState, action) {
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.memberCards
        };
    }
    let memberCardsState = {...state};
    switch (action.type) {
        case actions.SET_MY_MEMBER_CARDS:
            action.memberCards.forEach(card => {
                let findMemberCard =  memberCardsState.memberCards.filter(memberCard => memberCard._id === card._id);
                if(findMemberCard.length > 0){
                    card.qrCode = findMemberCard[0].qrCode
                }
            })
            return {
                ...state,
                memberCards: action.memberCards,
            };
        case actions.SET_CARD_QRCODE:
            let card =  memberCardsState.memberCards.filter(card => card._id === action.cardId)[0];
            card.qrCode = action.qrCode;
            memberCardsState.update = !memberCardsState.update;
            return memberCardsState;
        default:
            return state;
    }
};
