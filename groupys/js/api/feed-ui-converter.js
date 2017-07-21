/**
 * Created by roilandshut on 26/03/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */

const noPic = require('../../images/client_1.png');
import store from 'react-native-simple-store';
class FeedConverter
{

    createFeed(feed,contacsMap,phoneUser) {
        let response = undefined;
        if (feed.activity.business) {
            let name = feed.activity.actor_user.phone_number;
            let contact = contacsMap.get(feed.activity.actor_user.phone_number);
            if (contact) {
                name = contact.givenName + ' ' + contact.familyName;
            }
            if (feed.activity.business.pictures.length > 0) {
                response = {
                    id: feed.activity.business._id,
                    fid: feed.fid,
                    social: {
                        like: feed.activity.actor_user.social_state.like,
                        numberLikes: feed.activity.actor_user.social_state.likes,
                        follow: feed.activity.actor_user.social_state.follow,
                    },
                    actor: feed.activity.actor_user._id,
                    itemTitle: name + ' ' + feed.activity.action,
                    name: feed.activity.business.name,
                    description: feed.activity.business.name + ' location: ' + feed.activity.business.city + ' ' + feed.activity.business.address,
                    banner: {
                        uri: feed.activity.business.pictures[0].pictures[1]
                    },
                    showSocial: true,
                }
            } else {

                response = {
                    id: feed.activity.business._id,
                    fid: feed.fid,
                    social: {
                        like: feed.activity.actor_user.social_state.like,
                        numberLikes: feed.activity.actor_user.social_state.likes,
                        follow: feed.activity.actor_user.social_state.follow,
                    },
                    name: feed.activity.business.name,
                    actor: feed.activity.actor_user._id,
                    itemTitle: name + ' ' + feed.activity.action,
                    description: feed.activity.business.name + ' location: ' + feed.activity.business.city + ' ' + feed.activity.business.address,
                    showSocial: true,
                }
            }

            response.itemType = 'BUSINESS';
        }

        if (feed.activity.action == 'group_message' || feed.activity.action == 'group_follow') {

            let user = feed.activity.actor_user;
            if (!user) {
                user = feed.activity.user;
            }
            let name = user.phone_number;
            let contact = contacsMap.get(user.phone_number);
            if (contact) {
                name = contact.givenName + ' ' + contact.familyName;
            }
            if (user.name) {
                name = user.name;
            }

            response = {
                id: feed._id,

                actor: user._id,
                showSocial: false,
                description: feed.activity.message,

            }
            if (user.pictures && user.pictures.length > 0) {

                response.logo = {
                    uri: user.pictures[user.pictures.length - 1].pictures[0]
                }

            }else {
                response.logo = noPic;
            }
            if(phoneUser.phone_number == user.phone_number ) {
                response.userMessage = true;
            }else{
                response.userMessage = false;
            }

            response.name = name;
            if(feed.activity.action == 'group_follow'){
                response.description= "jonied the group";
            }
            response.itemType = 'MESSAGE';
        }
        if (feed.activity.action == 'instance' || feed.activity.action == 'eligible') {
            return this.createPromontionInstance(feed);
        }


        return response;


    }


    createSavedPomotion(feed){
        let instance = feed.instance;
        let responseFeed = {};
        try {

            responseFeed.id = instance._id;
            responseFeed.fid = instance.gid;

           responseFeed.name = instance.promotion.name;
            responseFeed.description = instance.promotion.description;


            switch (instance.type) {
                case "REDUCED_AMOUNT":
                    responseFeed.itemTitle = "Buy For " + instance.promotion.reduced_amount.values[0].price + ' Pay Only ' + instance.promotion.reduced_amount.values[0].pay;
                    responseFeed.promotion = 'REDUCE AMOUNT';
                    responseFeed.promotionColor = '#e65100';
                    break;
                case "PERCENT":
                    if(instance.promotion.condition.product){
                        responseFeed.itemTitle = "Get " +instance.promotion.condition.product.name + " with "+ instance.promotion.percent.values[0] + ' % Off ' ;

                    }else {
                        responseFeed.itemTitle = "Get " + instance.promotion.percent.values[0] + ' % Off ';
                    }
                    responseFeed.promotion = 'PRECENT';
                    responseFeed.promotionColor = '#df80ff';
                    break;
                case "X_FOR_Y":
                    responseFeed.itemTitle = 'Buy ' + instance.promotion.x_for_y.values[0].eligible + " " +  instance.promotion.condition.product.name + " Pay only " + instance.promotion.x_for_y.values[0].pay;
                    responseFeed.promotion = 'X_FOR_Y';
                    responseFeed.promotionColor = '#ff66b3';
                    break;
                case "X+N%OFF":
                    responseFeed.itemTitle = 'Buy ' +   instance.promotion.condition.product.name + " Get " +  instance.promotion.x_plus_n_percent_off.values[0].product.name + " with "+instance.promotion.x_plus_n_percent_off.values[0].eligible + " %Off" ;
                    responseFeed.promotion = 'X+N%OFF';
                    responseFeed.promotionColor = '#ff66b3';
                    break;
                case "X+Y":
                    responseFeed.itemTitle = 'Buy ' + instance.promotion.x_plus_y.values[0].buy + " " +  instance.promotion.condition.product.name + " Get " +instance.promotion.x_plus_y.values[0].eligible + " " +  instance.promotion.x_plus_y.values[0].product.name;
                    responseFeed.promotion = 'X+Y';
                    responseFeed.promotionColor = '#66ff1a';
                    break;

                case "PUNCH_CARD":
                    responseFeed.itemTitle = '' ;
                    responseFeed.promotion = 'PUNCH CARD';
                    responseFeed.promotionColor = '#d279a6';
                    break;

                default:
                    responseFeed.itemTitle = instance.type + " NOT SUPPORTED"
                    responseFeed.promotion = instance.type;
                    responseFeed.promotionColor = 'black';
                    break;

            }

            if (instance.promotion.entity && instance.promotion.entity.business.pictures.length > 0) {
                responseFeed.businessLogo = instance.promotion.entity.business.pictures[0].pictures[3];
                responseFeed.businessName = instance.promotion.entity.business.name;
                responseFeed.businessAddress = instance.promotion.entity.business.city + ' ' + instance.promotion.entity.business.address;
            }else {
                responseFeed.businessName = instance.promotion.entity.business.name;
                responseFeed.businessAddress = finstance.promotion.entity.business.city + ' ' + instance.promotion.entity.business.address;

            }
            responseFeed.itemType = 'PROMOTION';
        }catch (error){
            console.log('error');
        }
        return responseFeed;
    }


    createPromontionInstance(feed){
        let responseFeed = {};
        try {

            responseFeed.id = feed.activity.instance._id;
            responseFeed.fid = feed._id;
            responseFeed.activityId = feed.activity._id;
            responseFeed.social = {
                like: feed.activity.instance.social_state.like,
                numberLikes: feed.activity.instance.social_state.likes,
                follow: feed.activity.instance.social_state.follow,
                saved: feed.activity.instance.social_state.saved,
                realized: feed.activity.instance.social_state.realized,
                use: feed.activity.instance.social_state.use,
            };

            responseFeed.showsave = !feed.activity.instance.social_state.saved && !feed.activity.instance.social_state.realized;
            responseFeed.name = feed.activity.promotion.name;
            responseFeed.description = feed.activity.promotion.description;
            responseFeed.showSocial = true;
            if (feed.activity.promotion.pictures.length > 0) {
                responseFeed.banner = {
                    uri: feed.activity.promotion.pictures[0].pictures[1]
                };
            }
            switch (feed.activity.instance.type) {
                case "REDUCED_AMOUNT":
                    responseFeed.itemTitle = "Buy For " + feed.activity.promotion.reduced_amount.values[0].price + ' Pay Only ' + feed.activity.promotion.reduced_amount.values[0].pay;
                    responseFeed.promotion = 'REDUCED AMOUNT';
                    responseFeed.promotionColor = '#e65100';
                    break;
                case "PERCENT":
                    if( feed.activity.promotion.condition.product) {
                        responseFeed.itemTitle = "Get " +feed.activity.promotion.condition.product.name + " with " + feed.activity.promotion.percent.values[0] + ' % Off ';

                    }else {
                        responseFeed.itemTitle = "Get " + feed.activity.promotion.percent.values[0] + ' % Off ';
                    }
                    responseFeed.promotion = 'PERCENT';
                    responseFeed.promotionColor = '#df80ff';
                    break;
                case "X_FOR_Y":
                    responseFeed.itemTitle = 'Buy ' + feed.activity.promotion.x_for_y.values[0].eligible + " " +  feed.activity.promotion.condition.product.name + " Pay only " + feed.activity.promotion.x_for_y.values[0].pay;
                    responseFeed.promotion = 'X FOR Y';
                    responseFeed.promotionColor = '#ff66b3';
                    break;
                case "X+N%OFF":
                    responseFeed.itemTitle = 'Buy ' +   feed.activity.promotion.condition.product.name + " Get " +  feed.activity.promotion.x_plus_n_percent_off.values[0].product.name + " with "+feed.activity.promotion.x_plus_n_percent_off.values[0].eligible + " %Off" ;
                    responseFeed.promotion = 'X+N%OFFf';
                    responseFeed.promotionColor = '#ff66b3';
                    break;
                case "X+Y":
                    responseFeed.itemTitle = 'Buy ' + feed.activity.promotion.x_plus_y.values[0].buy + " " +  feed.activity.promotion.condition.product.name + " Get " +feed.activity.promotion.x_plus_y.values[0].eligible + " " +  feed.activity.promotion.x_plus_y.values[0].product.name;
                    responseFeed.promotion = 'X+Y';
                    responseFeed.promotionColor = '#66ff1a';
                    break;

                case "PUNCH_CARD":
                    responseFeed.itemTitle = '' ;
                    responseFeed.promotion = 'PUNCH CARD';
                    responseFeed.promotionColor = '#d279a6';
                    break;

                default:
                    responseFeed.itemTitle = feed.activity.instance.type + " NOT SUPPORTED"
                    responseFeed.promotion = feed.activity.instance.type;
                    responseFeed.promotionColor = 'black';
                    break;

            }

            if (feed.activity.promotion.entity && feed.activity.promotion.entity.business.pictures.length > 0) {
                responseFeed.businessLogo = feed.activity.promotion.entity.business.pictures[0].pictures[3];
                responseFeed.businessName = feed.activity.promotion.entity.business.name;
                responseFeed.businessAddress = feed.activity.promotion.entity.business.city + ' ' + feed.activity.promotion.entity.business.address;
            }
            responseFeed.itemType = 'PROMOTION';
        }catch (error){
            console.log('error');
        }
        return responseFeed;
    }
}

// if(this.state.type == 'PERCENT'){
//     promotion.percent = {};
//     promotion.percent.variation = 'SINGLE';
//     promotion.percent.values = [this.state.percent.percent]
//     promotion.percent.quantity = Number(this.state.quantity)
//     if(this.state.percent.retail_price) {
//         promotion.retail_price = Number(this.state.percent.retail_price)
//     }
// }
//
// if(this.state.type == 'REDUCED_AMOUNT'){
//     promotion.reduced_amount = {};
//     promotion.reduced_amount.variation = 'SINGLE';
//     promotion.reduced_amount.quantity = Number(this.state.quantity)
//     promotion.reduced_amount.values = [{
//         price: Number(this.state.reduced_amount.values.price),
//         pay: Number(this.state.reduced_amount.values.pay),
//
//     }]
// }
// if(this.state.type == 'X_FOR_Y'){
//     promotion.x_for_y = {};
//     promotion.x_for_y.variation = 'SINGLE';
//     promotion.x_for_y.quantity = Number(this.state.quantity)
//     promotion.x_for_y.values = [{
//         price: Number(this.state.x_for_y.values.price),
//         pay: Number(this.state.x_for_y.values.pay),
//
//     }]
// }
// if(this.state.type == 'X+N%OFF'){
//     promotion.x_plus_n_percent_off = {};
//     promotion.x_plus_n_percent_off.variation = 'SINGLE';
//     promotion.x_plus_n_percent_off.quantity = Number(this.state.quantity);
//     promotion.x_plus_y.values = {
//         eligible: Number(this.state.x_plus_n_percent_off.values.eligible),
//         product:this.state.giftProduct,
//
//     };
// }
//
// if(this.state.type == 'X+Y'){
//     promotion.x_plus_y = {};
//     promotion.x_plus_y.variation = 'SINGLE';
//     promotion.x_plus_y.quantity = Number(this.state.quantity);
//     promotion.x_plus_y.values = {
//         eligible: Number(this.state.x_plus_y.values.eligible),
//         buy : Number(this.state.x_plus_y.values.buy),
//         product:this.state.giftProduct,
//
//     };
//
//
// }
//
// if(this.state.type == 'PUNCH_CARD'){
//     promotion.punch_card = {};
//     promotion.punch_card.variation = 'SINGLE';
//     promotion.punch_card.quantity = Number(this.state.quantity);
//     promotion.punch_card.values = {
//         number_of_punches: Number(this.state.punch_card.values.number_of_punches),
//         product:this.state.giftProduct,
//
//     };




export default FeedConverter;