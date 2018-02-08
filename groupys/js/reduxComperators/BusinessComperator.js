import getStore from "../store";

const reduxStore = getStore();

class BusinessComperator {
    shouldUpdateBusinesses(newBusinesses) {


        let businesses = reduxStore.getState().businesses.businesses;

        if(Object.keys(businesses).length === 0){
            return true;
        }

        let shouldUpdate = false;
        if (newBusinesses) {
            newBusinesses.forEach(business => {
                if (!businesses[business.business._id]) {
                    shouldUpdate =  true;
                }else {
                    if (this.businessUdated(businesses[business.business._id], business.business, business.categoryTitle)) {
                        shouldUpdate = true;
                    }
                }
            })
        }
        return shouldUpdate;
    }

    businessUdated(business, newBusiness, categoryTitle) {
        if (business.categoryTitle !== categoryTitle && categoryTitle) {
            return true;
        }
        if (business.logo !== newBusiness.logo) {
            return true;
        }
        if (newBusiness.review) {
            if (!business.review) {
                return true;
            }
            if (newBusiness.review.state !== business.review.state ||
                newBusiness.review.result !== business.review.result ||
                newBusiness.review.status !== business.review.status
            ) {
                return true;
            }
        }
        if (newBusiness.pictures.length !== Object.keys(business.pictures).length) {
            return true;
        }
        if (newBusiness.social_state.comments !== business.social_state.comments) {
            return true;
        }
        if (newBusiness.social_state.follow !== business.social_state.follow) {
            return true;
        }
        if (newBusiness.social_state.followers !== business.social_state.followers) {
            return true;
        }
        if (newBusiness.social_state.like !== business.social_state.like) {
            return true;
        }
        if (newBusiness.social_state.likes !== business.social_state.likes) {
            return true;
        }
        if (newBusiness.social_state.share !== business.social_state.share) {
            return true;
        }
        if (newBusiness.social_state.shares !== business.social_state.shares) {
            return true;
        }

        if (newBusiness.address !== business.address) {
            return true;
        }
        if (newBusiness.category !== business.category) {
            return true;
        }
        if (newBusiness.city !== business.city) {
            return true;
        }
        if (newBusiness.country !== business.country) {
            return true;
        }
        if (newBusiness.email !== business.email) {
            return true;
        }
        if (newBusiness.tax_id !== business.tax_id) {
            return true;
        }


        return false;
    }


}
export default BusinessComperator;