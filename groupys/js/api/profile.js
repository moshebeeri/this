/**
 * Created by roilandshut on 26/03/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */
import Timer from "./LogTimer";

let timer = new Timer();
import * as errors from './Errors'
class ProfileApi {
    clean_phone_number(number) {
        // remove all non digits, and then remove 0 if it is the first digit
        return number.replace(/\D/g, '').replace(/^0/, '')
    };

    fetch(token, from, to) {
        return new Promise(async (resolve, reject) => {
            try {
                let fromDate = new Date();
                const response = await fetch(`${server_host}/api/profiles/instances/saved/` + from + `/` + to + `/`, {
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
                timer.logTime(fromDate, new Date(), 'profiles', 'instances/saved');
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        });
    }
}

export default ProfileApi;