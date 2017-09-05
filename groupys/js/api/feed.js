/**
 * Created by roilandshut on 25/04/2017.
 */
import store from 'react-native-simple-store';
import UserApi from './user'
let userApi = new UserApi();

import  FeedUiConverter from './feed-ui-converter'
let feedUiConverter = new FeedUiConverter();
import Timer from './LogTimer'

let timer = new Timer();
class FeedApi {


    clean_phone_number(number){
        // remove all non digits, and then remove 0 if it is the first digit
        return number.replace(/\D/g, '').replace(/^0/,'')
    };


    getAll(direction,id, userId) {
        return new Promise(async(resolve, reject) => {

            try {
                let from = new Date();

                let token = await store.get('token');
                let user = await store.get('user');
                if(!userId){
                    userId = await store.get('user_id');
                    if(!userId){
                       let user = await userApi.getUser();
                       userId = user._id;
                    }
                }

                let contacts = await store.get("all-contacts");
                contacts = JSON.parse(contacts);
                const response = await fetch(`${server_host}/api/feeds/`+id+`/`+ direction +`/` +userId , {
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

                timer.logTime(from,new Date(),'feeds','/')


                resolve(responseData);
            }
            catch (error) {

                // console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })


    }
//feed template
// {
//     social:{
//         like:false,
//         numberLikes: 12,
//
//
//
//     },
//     logo:{
//         require:aroma,
//     },
//     itemTitle: 'Cafe 20% off',
//     description: 'Cafe Discount',
//     banner: {
//         require:aromCafe
//     }
// },


}

export default FeedApi;