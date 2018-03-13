import {call, takeLatest, put, throttle} from 'redux-saga/effects'
import NotificationApi from "../api/notification";
import {setNotification} from "../actions/notifications";
import * as segaActions from './segaActions'
import {handleSucsess}from './SegaSuccsesHandler'
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


function* notificationSega() {
    yield throttle(2000, segaActions.SAVE_NOTIFICATION_REQUEST, saveNotificationRequest);
}

export default notificationSega;