import getStore from "../store";
import instanceUtils  from '../utils/instanceUtils'
const reduxStore = getStore();

class SavedPromotionComperator {
    shuoldAddInstances(response) {
        let feedInstances = reduxStore.getState().myPromotions.feeds;
        if(response[0] && response[0].savedInstance) {
            if (feedInstances[response[0].savedInstance._id]) {
                return false;
            }
        }
        return true;
    }

    shuoldUpdateInstance(response) {
        if(instanceUtils.checkIfRealized(response)){
            return true;
        }
        return false;



    }
}

export default SavedPromotionComperator;