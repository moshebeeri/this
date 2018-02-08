import getStore from "../store";
const reduxStore = getStore();

class MainFeedComperator{



    shouldUpdateSocial(id,response){
        let feedInstances = reduxStore.getState().instances.instances;
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




}

export default MainFeedComperator;