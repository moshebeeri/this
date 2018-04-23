import store from "react-native-simple-store";
import serverRequestHandler from './serverRequestHandler';

class LocationApi {
    async sendLocation(lng, lat, time, speed) {
        let token = await store.get('token');
        let request = {
            locations: [{
                timestamp: time,
                lat: lat,
                lng: lng,
                speed: speed
            }],
        };
        return serverRequestHandler.fetch_handler(`${server_host}/api/locations`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(request)
        }, 'locations', '/');
    }
}

export default LocationApi;