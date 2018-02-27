class MainFeedComperator {
    shouldUpdateSocial(instance, response) {
        if (instance) {
            let currentSocialState = instance.social_state;
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
    filterFeed(feed) {
        if (feed.activity && feed.activity.promotion) {
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

const feedComperator = new MainFeedComperator();
export default feedComperator;