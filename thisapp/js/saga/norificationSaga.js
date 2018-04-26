import {call, put, throttle} from 'redux-saga/effects'
import NotificationApi from "../api/notification";
import {setNotification} from "../actions/notifications";
import * as sagaActions from './sagaActions'
import * as actions from '../reducers/reducerActions'
import {handleSucsess} from './SagaSuccsesHandler'

let notificationApi = new NotificationApi();

function* saveNotificationRequest(action) {
    try {
        let response = yield call(notificationApi.getAll, action.token, action.user, action.skip, action.limit);
        handleSucsess();
        yield put(setNotification(response))
    } catch (error) {
        console.log("failed  saveNotificationRequest");
    }
}

function* setTopNotification(action) {
    try {
        let response = yield call(notificationApi.getAll, action.token, action.user, 0, 10);
        handleSucsess();
        yield put({
            type: actions.SET_TOP_NOTIFICATION,
            notifications: response,
        })
    } catch (error) {
        console.log("failed  saveNotificationRequest");
    }
}

function* handleGeneralNotification(action) {
    try {
       // yield call(notificationApi.readNotification, action.token, action.notificationId);
    } catch (error) {
        console.log("failed  handleCommentNotification");
    }
}

function* handleCommentNotification(action) {
    try {
        if(action.token) {
            yield call(notificationApi.readNotification, action.token, action.notificationId);
            yield call(notificationApi.resetBadgeNotification, action.token);
        }
        //TODO add comment annotation
    } catch (error) {
        console.log("failed  handleCommentNotification");
    }
}

function* notificationSaga() {
    yield throttle(2000, sagaActions.SAVE_NOTIFICATION_REQUEST, saveNotificationRequest);
    yield throttle(2000, sagaActions.SAVE_NOTIFICATION_TOP_REQUEST, setTopNotification);
    yield throttle(2000, sagaActions.ADD_GENERAL_NOTIFICATION, handleGeneralNotification);
    yield throttle(2000, sagaActions.ADD_COMMENT_NOTIFICATION, handleCommentNotification);
}

export default notificationSaga;