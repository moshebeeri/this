import serverRequestHandler from './serverRequestHandler';

class ActivityApi {
    shareActivity(user, activity, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/activities/share/${activity}/${user._id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            }
        }, 'activity', 'activity/:userId')
    }

    reportActivity(activityId, report, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/activities/feedback/${activityId}/${report}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            }
        }, 'activity', 'activity/:feedback')
    }
}

export default ActivityApi;