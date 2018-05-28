import ActivityApu from '../api/activity'
import * as actions from "../reducers/reducerActions";

let activityApi = new ActivityApu();

export function reportActivity(activityId, report, group,feedId) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        activityApi.reportActivity(activityId, report, token);
        dispatch({
            type: actions.REMOVE_FEED,
            activityId: activityId,
            groupId: group ? group._id : undefined
        });
    }
}

