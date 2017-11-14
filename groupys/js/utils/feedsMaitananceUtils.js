import FeedApi from "../api/feed";
import * as actions from "../reducers/reducerActions";

let feedApi = new FeedApi();
const refreshFeeds = (store) => {
    if (store.getState().authentication.token) {
        let token = store.getState().authentication.token;
        if(store.getState().instances && store.getState().instances.instances) {
            Object.keys(store.getState().instances.instances).forEach(async instance => {
                let response = await feedApi.getFeedSocialState(instance, token);
                store.dispatch({
                    type: actions.FEED_UPDATE_SOCIAL_STATE,
                    social_state: response,
                    id: instance
                });
            });
        }
    }
}

export default {
    refreshFeeds
};