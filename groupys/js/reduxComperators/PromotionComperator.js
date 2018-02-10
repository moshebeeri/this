import getStore from "../store";

const reduxStore = getStore();

class PromotionComperator {
    //in case some data is missing we should filter the feed
    filterPromotion(promotion) {
        if (promotion.pictures && promotion.pictures.length === 0) {
            return false
        }
        if(!promotion.social_state){
            return false
        }
        return true;
    }
}

export default PromotionComperator;