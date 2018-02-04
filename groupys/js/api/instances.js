import Timer from "./LogTimer";

let timer = new Timer();
import * as errors from './Errors'
class InstanceApi {
    getInstance(token,instanceId) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/instances/` + instanceId, {
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
                timer.logTime(from, new Date(), 'instances', '/');
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

}

export default InstanceApi;