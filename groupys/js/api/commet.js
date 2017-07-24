/**
 * Created by roilandshut on 23/07/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */
import store from 'react-native-simple-store';
import Timer from './LogTimer'

let timer = new Timer();

class CommentApi {



    getInstanceGroupComments(group,instance) {
        return new Promise(async(resolve, reject) => {

            try {
                let from = new Date();
                let request = {
                    entities: {
                        group:group,
                        instance:instance

                    }
                };


                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/comments/`+0+'/' +100, {
                    method: 'GET',
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
                timer.logTime(from,new Date(),'comments','/skip/limit')

                resolve(responseData);
            }
            catch (error) {

                // console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        });


    }
}

export default CommentApi;