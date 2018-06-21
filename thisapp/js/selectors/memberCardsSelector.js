import {createSelector} from 'reselect'
const getStateCards = (state) => state.memberCards;

export const getMyCards = createSelector([getStateCards],
    (memberCards) => {
        let cards = []
        if (!_.isEmpty(memberCards.memberCards)) {
           memberCards.memberCards.forEach(
                card => {
                    cards.push({
                        business: card.cardType.entity.business,
                        _id : card._id,
                        points: card.points,
                        cardType: card.cardType,
                        qrCode: card.qrCode
                    })
                }
            )
            return cards;
        }
        return cards;
    });
