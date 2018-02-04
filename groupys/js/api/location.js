import store from "react-native-simple-store";
import * as errors from './Errors'
class LocationApi {
    sendLocation(lng, lat, time, speed) {
        return new Promise(async (resolve, reject) => {
            try {
                let token = await store.get('token');
                let request = {
                    locations: [{
                        timestamp: time,
                        lat: lat,
                        lng: lng,
                        speed: speed
                    }
                    ],
                };
                const response = await fetch(`${server_host}/api/locations`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(request)
                });
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }
}

export default LocationApi;