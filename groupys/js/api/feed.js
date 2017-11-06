/**
 * Created by roilandshut on 25/04/2017.
 */
import Timer from "./LogTimer";

let timer = new Timer();

class FeedApi {
    clean_phone_number(number) {
        // remove all non digits, and then remove 0 if it is the first digit
        return number.replace(/\D/g, '').replace(/^0/, '')
    };

    getAll(direction, id, token, user) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                let userId = user._id;
                const response = await fetch(`${server_host}/api/feeds/` + id + `/` + direction + `/` + userId, {
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
                timer.logTime(from, new Date(), 'feeds', '/');
                resolve(responseData);
            }
            catch (error) {
                reject(error);
            }
        })
    }
}

export default FeedApi;