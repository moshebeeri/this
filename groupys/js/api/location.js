import store from 'react-native-simple-store';

class LocationApi
{
    sendLocation(lng,lat,time,speed) {
        return new Promise(async(resolve, reject) => {

            try {
                let token = await store.get('token');
                let userId = await store.get('user_id');
                let request = {
                    locations : [{
                        timestamp : time,
                        lat : lat,
                        lng : lng,
                        speed: speed
                    }],
                    userId: userId,
                };


                const response = await fetch(`${server_host}/api/locations`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    },
                    body: JSON.stringify(request)

                })
                if (response.status == '401') {
                    reject(response);
                    return;
                }

                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })


    }
}

export default LocationApi;