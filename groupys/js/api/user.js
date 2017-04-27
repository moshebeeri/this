/**
 * Created by roilandshut on 13/03/2017.
 */
import store from 'react-native-simple-store';

class UserApi
{
    getUser() {
        return new Promise(async(resolve, reject) => {
            try {
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/users/me/`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token,
                    }

                })
                if (response.status == '401') {
                    reject(error);
                    return;
                }

                let responseData = await response.json();
                store.save('user_id', responseData._id);

                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })


    }

    like(id){
        return new Promise(async(resolve, reject) => {
            try {
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/users/like/`+id, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token,
                    }

                })
                if (response.status == '401') {
                    reject(error);
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

export default UserApi;