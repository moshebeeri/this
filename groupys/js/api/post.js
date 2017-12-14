/**
 * Created by roilandshut on 10/05/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */
import store from "react-native-simple-store";
import EntityUtils from "../utils/createEntity";
import Timer from "./LogTimer";

let entityUtils = new EntityUtils();
let timer = new Timer();

class PostApi {
    createPost(post, callbackFunction, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/posts/`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(post)
                });
                if (response.status ==='401' || response.status ==='500') {
                    reject(response);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'post', '/');

                if (post.image) {
                    entityUtils.doUpload(post.image.path, post.image.mime, token, callbackFunction, 'posts', responseData);
                } else {
                    if (post.uploadVideo) {
                        entityUtils.doVideoUpload(post.uploadVideo.path, post.uploadVideo.mime, token, callbackFunction, 'posts', responseData);

                    }else {
                        callbackFunction(responseData);
                    }
                }
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })
    }


}

export default PostApi;