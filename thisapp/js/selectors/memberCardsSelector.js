import {createSelector} from 'reselect'
const getStateMyBusinesses = (state) => state.businesses;

export const getMyCards = createSelector([getStateMyBusinesses],
    (businesses) => {
        let cards = []
        if (!_.isEmpty(businesses.businesses)) {
            Object.keys(businesses.businesses).forEach(
                key => {
                    cards.push({
                        business: businesses.businesses[key],
                        _id : key + '_card',
                        points: 250
                    })
                }
            )
            return cards;
        }
        return cards;
    });
