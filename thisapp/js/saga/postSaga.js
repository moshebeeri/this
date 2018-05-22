import {call, put, throttle} from 'redux-saga/effects'
import PostApi from "../api/post";
import {setPostActivity, syncProductChange} from "../actions/posts";
import * as sagaActions from './sagaActions'
import ImageApi from "../api/image";

const postApi = new PostApi();

function* savePost(action) {
    try {
        let tempPost = action.post;
        let tempAcitivity = {};
        tempAcitivity.activity = {};
        tempAcitivity.activity.post = tempPost;
        tempAcitivity.activity.actor_user = action.user;
        tempAcitivity.activity._id = 'temp_activity' +  new Date().getTime();
        // Workaround default product categories
        tempPost._id = 'temp_post' + new Date().getTime();
        tempPost.pictures = [];
        let pictures = [];
        if (action.post.image) {
            pictures.push(action.post.image.path);
            pictures.push(action.post.image.path);
            pictures.push(action.post.image.path);
            pictures.push(action.post.image.path);
            tempPost.pictures.push({pictures: pictures});
        }

        if(action.post.uploadVideo){
            tempPost.video = action.post.uploadVideo;
        }
        yield put(setPostActivity(tempAcitivity, action.group));
        let imageResponse = undefined;
        if (action.post.image) {
            imageResponse = yield call(ImageApi.uploadImage, action.token, action.post.image, 'image');
        }
        let videoResponse = undefined;
        if (action.post.uploadVideo) {
            videoResponse = yield call(ImageApi.uploadVideo, action.token, action.post.uploadVideo);
        }
        if (imageResponse) {
            tempPost.pictures = imageResponse.pictures;
        }
        if (videoResponse) {
            tempPost.video = videoResponse._id
        }
        tempPost._id = undefined;
        yield call(postApi.createNewPost, tempPost, action.token);
    } catch (error) {
        console.log("failed  updateProductn");
    }
}

function* productSaga() {
    yield throttle(2000, sagaActions.SAVE_POST, savePost);
}

export default productSaga;