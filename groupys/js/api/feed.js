/**
 * Created by roilandshut on 25/04/2017.
 */
import Timer from "./LogTimer";

let timer = new Timer();
import MainFeedReduxComperator from "../reduxComperators/MainFeedComperator"
let feedComperator = new MainFeedReduxComperator();
import * as errors from './Errors'
class FeedApi {
    timeout(ms, promise) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                reject(errors.TIME_OUT);
            }, ms)
            promise.then(resolve, reject)
        })
    }
    getAll(direction, id, token, user) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                let userId = user._id;
                const response = await fetch(`${server_host}/api/feeds/` + id + `/` + direction + `/` + userId, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                let responseData = await response.json();
               // responseData = responseData.filter(feed => feedComperator.filterFeed(feed));
                timer.logTime(from, new Date(), 'feeds', '/');
                resolve(responseData);
            }
            catch (error) {
                if(error === errors.TIME_OUT){
                    reject({ type: errors.TIME_OUT, debugMessage:'api/feeds/ Timed out'});
                }
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    getFeedSocialState(id,token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/feeds/social_state/` + id, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'feeds', '/social_state');
                resolve(responseData);
            }
            catch (error) {
                if(error === errors.TIME_OUT){
                    reject({ type: errors.TIME_OUT, debugMessage:'api/feeds/social_state Timed out'});
                }
                reject(errors.NETWORK_ERROR);
            }
        })
    }


}

export default FeedApi;