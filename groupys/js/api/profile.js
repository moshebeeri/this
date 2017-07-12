/**
 * Created by roilandshut on 26/03/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */
import store from 'react-native-simple-store';
import Timer from './LogTimer'

let timer = new Timer();

class ProfileApi {
    clean_phone_number(number) {
        // remove all non digits, and then remove 0 if it is the first digit
        return number.replace(/\D/g, '').replace(/^0/, '')
    };

    createfeed(feed){
        let response = {};
        if(feed.instance.promotion.pictures.length > 0  ){
            response = {
                id:feed.instance._id,



                itemTitle: 'Promotion : ' + feed.instance.promotion.percent.values[0] + ' % off',
                description: feed.instance.promotion.entity.business.name + ' ' + feed.instance.promotion.entity.business.city + ' ' + feed.instance.promotion.entity.business.address + ' offer a new promotion',
                banner: {
                    uri:feed.instance.promotion.pictures[0].pictures[1]
                },
                relcode:feed.graph.rel.properties.code
            }
        }else {

            response = {
                id:feed.instance._id,
                itemTitle: 'Promotion : ' + feed.instance.promotion.percent.values[0] + ' % off',
                description: feed.instance.promotion.entity.business.name + ' ' + feed.instance.promotion.entity.business.city + ' ' + feed.instance.promotion.entity.business.address + ' offer a new promotion',
                relcode:feed.graph.rel.properties.code
            }
        }
        return response


    }

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
                     feeds = responseData.map(feed => this.createfeed(feed)).filter(function (x) {
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