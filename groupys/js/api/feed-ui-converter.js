/**
 * Created by roilandshut on 26/03/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */


class FeedConverter
{

    createFeed(feed,contacsMap) {
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
        if (feed.activity.action == 'group_follow') {
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
                itemTitle: name,
                description: 'joined the group',
                showSocial: false,
            }
            if (user.pictures && user.pictures.length > 0) {

                response.logo = {
                    uri: user.pictures[user.pictures.length - 1].pictures[0]
                }


            }

            response.itemType = 'GROUP_FOLLOW';
        }

        if (feed.activity.action == 'group_message') {

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

            }

            response.itemType = 'MESSAGE';
        }
        if (feed.activity.action == 'instance') {
            return this.createPromontionInstance(feed);
        }

        if (feed.activity.action == 'eligible') {
            if (feed.activity.promotion.pictures.length > 0) {
                response = {
                    id: feed.activity.instance._id,
                    fid: feed._id,
                    social: {
                        like: feed.activity.instance.social_state.like,
                        numberLikes: feed.activity.instance.social_state.likes,
                        follow: feed.activity.instance.social_state.follow,
                        saved: feed.activity.instance.social_state.saved,
                        realized: feed.activity.instance.social_state.realized,
                        use: feed.activity.instance.social_state.use,
                    },
                    showsave: !feed.activity.instance.social_state.saved && !feed.activity.instance.social_state.realized,
                    actor: feed.activity.actor_business._id,
                    itemTitle: feed.activity.promotion.percent.values[0] + ' % OFF',

                    address: feed.activity.actor_business.city + ' ' + feed.activity.actor_business.address,
                    description: feed.activity.promotion.description,
                    showSocial: true,
                    banner: {
                        uri: feed.activity.promotion.pictures[0].pictures[1]
                    },
                    name: feed.activity.actor_business.name,
                }

                if (feed.activity.actor_business.pictures.length > 0) {
                    response.businessLogo = feed.activity.actor_business.pictures[0].pictures[3];
                }
            } else {

                response = {
                    id: feed.activity.instance._id,
                    fid: feed._id,
                    social: {
                        like: feed.activity.instance.social_state.like,
                        numberLikes: feed.activity.instance.social_state.likes,
                        follow: feed.activity.instance.social_state.follow,
                        saved: feed.activity.instance.social_state.saved,
                        realized: feed.activity.instance.social_state.realized,
                        use: feed.activity.instance.social_state.use,
                    },
                    showsave: !feed.activity.instance.social_state.saved && !feed.activity.instance.social_state.realized,
                    actor: feed.activity.actor_business._id,
                    itemTitle: feed.activity.promotion.percent.values[0] + ' % OFF',
                    address: feed.activity.actor_business.city + ' ' + feed.activity.actor_business.address,
                    description: feed.activity.promotion.description,
                    name: feed.activity.actor_business.name,
                    showSocial: true,
                }
            }

        }
        return response;


    }

    createPromontionInstance(feed){

        let responseFeed = {};
        responseFeed.id = feed.activity.instance._id;
        responseFeed.fid = feed._id;
        responseFeed.social = {
                like: feed.activity.instance.social_state.like,
                numberLikes: feed.activity.instance.social_state.likes,
                follow: feed.activity.instance.social_state.follow,
                saved:feed.activity.instance.social_state.saved,
                realized:feed.activity.instance.social_state.realized,
                use:feed.activity.instance.social_state.use,
            };

        responseFeed.showsave= !feed.activity.instance.social_state.saved && !feed.activity.instance.social_state.realized;
        responseFeed.name = feed.activity.promotion.name;
        responseFeed.description = feed.activity.promotion.description;
        responseFeed.showSocial = true;
        if (feed.activity.promotion.pictures.length > 0) {
            responseFeed.banner = {
                uri: feed.activity.promotion.pictures[0].pictures[1]
            };
        }
        switch (feed.activity.instance.type){
            case "REDUCED_AMOUNT":
                responseFeed.itemTitle ="Buy For "  +  feed.activity.promotion.reduced_amount.values[0].price + ' Pay Only ' +  feed.activity.promotion.reduced_amount.values[0].pay;
                responseFeed.promotion = 'Reduce Amount';
                responseFeed.promotionColor = '#e65100';
                break;
            default:
                responseFeed.itemTitle =feed.activity.instance.type + " NOT SUPPORTED"
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

        return responseFeed;
    }
}

export default FeedConverter;