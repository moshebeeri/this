/**
 * Created by roilandshut on 25/04/2017.
 */
import store from 'react-native-simple-store';

class FeedApi {


    clean_phone_number(number){
        // remove all non digits, and then remove 0 if it is the first digit
        return number.replace(/\D/g, '').replace(/^0/,'')
    };


    getAll(direction,id, userId) {
        return new Promise(async(resolve, reject) => {

            try {
                let token = await store.get('token');
                if(!userId){
                    userId = await store.get('user_id');
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


                let contacsMap = new Map();

                let normalizeFuncrion = this.clean_phone_number.bind(this);
                if(contacts) {
                    contacts.forEach(function (element) {
                        contacsMap.set(normalizeFuncrion(element.phoneNumbers[0].number), element);
                    });
                }
                let feeds = responseData.map(feed => this.createFeed(feed,contacsMap)).filter(function(x){
                    return x != undefined;
                });
                // console.log('token: ' + token +' user id' + userId + ' for item id: '+ id + ' direction: ' + direction + ' number of items: ' + feeds.length);
                resolve(feeds);
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


    createFeed(feed,contacsMap){
        let response = undefined;
        if(feed.activity.business){
            let name = feed.activity.actor_user.phone_number;
            let contact = contacsMap.get(feed.activity.actor_user.phone_number);
            if(contact){
                name = contact.givenName + ' ' + contact.familyName;
            }
            if(feed.activity.business.pictures.length > 0  ){
                response = {
                    id:feed._id,
                    social: {
                        like: feed.activity.actor_user.social_state.like,
                        numberLikes: feed.activity.actor_user.social_state.likes,
                        follow: feed.activity.actor_user.social_state.follow,
                    },
                    actor:feed.activity.actor_user._id,
                    itemTitle: name + ' ' + feed.activity.action + ' ' + feed.activity.business.name,
                    description: feed.activity.business.name + ' location: ' + feed.activity.business.city + ' ' + feed.activity.business.address,
                    banner: {
                        uri:feed.activity.business.pictures[0].pictures[1]
                    }
                                }
            }else {

                response = {
                    id:feed._id,
                    social: {
                        like: feed.activity.actor_user.social_state.like,
                        numberLikes: feed.activity.actor_user.social_state.likes,
                        follow: feed.activity.actor_user.social_state.follow,
                    },
                    actor:feed.activity.actor_user._id,
                    itemTitle: name+ ' ' + feed.activity.action + ' ' + feed.activity.business.name,
                    description: feed.activity.business.name + ' location: ' + feed.activity.business.city + ' ' + feed.activity.business.address,

                }
            }
        }
        if(feed.activity.action == 'group_follow'){
            let user = feed.activity.actor_user;
            if(!user){
                user = feed.activity.user;
            }
            let name = user.phone_number;
            let contact = contacsMap.get(user.phone_number);
            if(contact){
                name = contact.givenName + ' ' + contact.familyName;
            }
            response = {
                id:feed._id,
                social: {
                    like: user.social_state.like,
                    numberLikes: user.social_state.likes,
                    follow: user.social_state.follow,
                },
                actor:user._id,
                itemTitle: name ,
                description: 'joined the group',

            }
        }
        return response;


    }
}

export default FeedApi;