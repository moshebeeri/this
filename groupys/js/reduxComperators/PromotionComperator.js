import getStore from "../store";

const reduxStore = getStore();

class PromotionComperator {
    //in case some data is missing we should filter the feed
    filterPromotion(promotion) {
        if (promotion.pictures && promotion.pictures.length === 0) {
            return false
        }
        return true;
    }

    shouldUpdateSocial(item, response) {
        let currentSocialState = item.social_state;
        if (response.likes === currentSocialState.likes &&
            response.shares === currentSocialState.shares &&
            response.comments === currentSocialState.comments
            && response.saves === currentSocialState.saves
            && response.realizes === currentSocialState.realizes) {
            return false;
        }
        return true;
    }
}

export default PromotionComperator;