/**
 * Created by roilandshut on 26/03/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */
import store from 'react-native-simple-store';
import Timer from './LogTimer'
import  FeedUiConverter from './feed-ui-converter'
let feedUiConverter = new FeedUiConverter();
let timer = new Timer();

class ProfileApi {
    clean_phone_number(number) {
        // remove all non digits, and then remove 0 if it is the first digit
        return number.replace(/\D/g, '').replace(/^0/, '')
    };


    fetch(from, to) {
        return new Promise(async(resolve, reject) => {

            try {
                let from = new Date();

                let token = await store.get('token');
                  const response = await fetch(`${server_host}/api/profiles/instances/saved/` + from + `/` + to + `/`, {
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
                timer.logTime(from,new Date(),'profiles','instances/saved')

                let feeds = new Array();
                if(responseData.length > 0) {
                    feeds = responseData.map(feed => feedUiConverter.createSavedPomotion(feed)).filter(function(x){
                        return x != undefined;
                    });

                }
                resolve(feeds);
            }
            catch (error) {

                // console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        });


    }
}

export default ProfileApi;