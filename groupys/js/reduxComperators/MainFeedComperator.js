import getStore from "../store";
const reduxStore = getStore();

class MainFeedComperator{



    shouldUpdateSocial(state,id,response){
        let feedInstances = state.instances.instances;
        if (feedInstances[id]) {
            let currentSocialState = feedInstances[id].social_state;
            if (response.likes === currentSocialState.likes &&
                response.shares === currentSocialState.shares &&
                response.comments === currentSocialState.comments) {
                return false;
            }
            return true;
        }

        return false;

    }

    //in case some data is missing we should filter the feed
    filterFeed(feed){
        if(feed.activity && feed.activity.promotion ) {
            let promotion = feed.activity.promotion;
            if (promotion.pictures.length === 0) {
                return false
            }
            if (!promotion.entity) {
                return false
            }
            if (!promotion.entity.business) {
                return false
            }
            if (promotion.entity.business.pictures.length === 0) {
                return false
            }
        }
        return true;

    }




}

export default MainFeedComperator;