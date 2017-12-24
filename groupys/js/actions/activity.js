import * as actions from "../reducers/reducerActions";
import ActivityApu from '../api/activity'
let activityApi = new ActivityApu();

export function reportActivity(activityId,report) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        activityApi.reportActivity(activityId,report,token)
    }
}

