/**
 * Created by roilandshut on 24/08/2017.
 */
/**
 * Created by roilandshut on 20/07/2017.
 */
import store from 'react-native-simple-store';

import Timer from './LogTimer'

let timer = new Timer();
class NotificationApi
{
    getAll() {
        return new Promise(async(resolve, reject) => {

            try {
                let from = new Date();
                let token = await store.get('token');
                let user = await store.get('user');
                const response = await fetch(`${server_host}/api/notifications/` +user._id + '/' + 0 +'/'+100, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    }

                })
                if (response.status == '401') {
                    reject(response);
                    return;
                }

                let responseData = await response.json();
                timer.logTime(from,new Date(),'notifications','my')
                resolve(responseData);


            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })


    }

}
export default NotificationApi;