import Timer from "./LogTimer";

let timer = new Timer();

class ActivityApi {
    shareActivity(user, activity, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/activities/share/` + activity + '/' + user._id, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'businesses', 'list/mine');
                resolve(responseData);
            }
            catch (error) {
                reject(error);
            }
        })
    }

    reportActivity(activityId,report,token){
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/activities/feedback/` + activityId+ '/' + report, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'activities', 'report');
                resolve(responseData);
            }
            catch (error) {
                reject(error);
            }
        })
    }
}

export default ActivityApi;