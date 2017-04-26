/**
 * Created by roilandshut on 25/04/2017.
 */
import store from 'react-native-simple-store';

class FeedApi {
    getAll() {
        return new Promise(async(resolve, reject) => {

            try {
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/feeds`, {
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
                let feeds = responseData.map(feed => this.createFeed(feed));
                resolve(feeds);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
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

    createFeed(feed){
        let response = undefined;
        if(feed.activity.business){
            if(feed.activity.business.pictures.length > 0  ){
                response = {
                    social: {
                        like: feed.activity.actor_user.social_state.like,
                        numberLikes: feed.activity.actor_user.social_state.likes,
                        follow: feed.activity.actor_user.social_state.follow,
                    },

                    itemTitle: feed.activity.actor_user._id + ' ' + feed.activity.action + ' ' + feed.activity.business.name,
                    description: feed.activity.business.name + ' location: ' + feed.activity.business.city + ' ' + feed.activity.business.address,
                    banner: {
                        uri:feed.activity.business.pictures[0].pictures[1]
                    }
                                }
            }else {

                response = {
                    social: {
                        like: feed.activity.actor_user.social_state.like,
                        numberLikes: feed.activity.actor_user.social_state.likes,
                        follow: feed.activity.actor_user.social_state.follow,
                    },

                    itemTitle: feed.activity.actor_user._id + ' ' + feed.activity.action + ' ' + feed.activity.business.name,
                    description: feed.activity.business.name + ' location: ' + feed.activity.business.city + ' ' + feed.activity.business.address,

                }
            }
        }
        return response;


    }
}

export default FeedApi;