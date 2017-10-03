import store from "react-native-simple-store";

class GeneralApi {
    submitREqeust(api, jsonRequest) {
        let json = JSON.parse(jsonRequest);
        return new Promise(async (resolve, reject) => {
            try {
                let token = await store.get('token');
                let userId = await store.get('user_id');
                console.log(userId + " " + token);
                const response = await fetch(`${server_host}/api/` + api, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(json)
                });
                if (response.status == '401' || response.status == '400') {
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

export default GeneralApi;