/**
 * Created by roilandshut on 20/07/2017.
 */
import store from 'react-native-simple-store';

import Timer from './LogTimer'

let timer = new Timer();
class ActivityApi
{
    shareActivity(user,activity) {
        return new Promise(async(resolve, reject) => {

            try {
                let from = new Date();
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/activities/share/` +activity + '/' + user._id, {
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
                timer.logTime(from,new Date(),'businesses','list/mine')
                resolve(responseData);


            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })


    }

}
export default ActivityApi;