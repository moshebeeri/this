/**
 * Created by roilandshut on 26/03/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */


class FeedConverter
{

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
                    id:feed.activity.business._id,
                    fid:feed.fid,
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
                    id:feed.activity.business._id,
                    fid:feed.fid,
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

        if(feed.activity.action == 'group_message'){
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
                description:feed.activity.message,

            }
        }

        if(feed.activity.action =='eligible'){
            if(feed.activity.promotion.pictures.length > 0  ){
                response = {
                    id:feed.activity.instance._id,
                    fid:feed._id,
                    social: {
                        like: feed.activity.instance.social_state.like,
                        numberLikes: feed.activity.instance.social_state.likes,
                        follow: feed.activity.instance.social_state.follow,
                        saved:feed.activity.instance.social_state.saved,
                        realized:feed.activity.instance.social_state.realized,
                        use:feed.activity.instance.social_state.use,
                    },
                    showsave:!feed.activity.instance.social_state.saved && !feed.activity.instance.social_state.realized,
                    actor:feed.activity.actor_business._id,
                    itemTitle: 'Promotion : ' + feed.activity.promotion.percent.values[0] + ' % off',
                    description: feed.activity.actor_business.name + ' ' + feed.activity.actor_business.city + ' ' + feed.activity.actor_business.address + ' offer a new promotion',
                    banner: {
                        uri:feed.activity.promotion.pictures[0].pictures[1]
                    }
                }

                if(feed.activity.actor_business.pictures.length > 0){
                    response.businessLogo = feed.activity.actor_business.pictures[0].pictures[3];
                }
            }else {

                response = {
                    id:feed.activity.instance._id,
                    fid:feed._id,
                    social: {
                        like: feed.activity.instance.social_state.like,
                        numberLikes: feed.activity.instance.social_state.likes,
                        follow: feed.activity.instance.social_state.follow,
                        saved:feed.activity.instance.social_state.saved,
                        realized:feed.activity.instance.social_state.realized,
                        use:feed.activity.instance.social_state.use,
                    },
                    showsave:!feed.activity.instance.social_state.saved && !feed.activity.instance.social_state.realized,
                    actor:feed.activity.actor_business._id,
                    itemTitle: 'Promotion : ' + feed.activity.promotion.percent.values[0] + ' % off',
                    description: feed.activity.actor_business.name + ' ' + feed.activity.actor_business.city + ' ' + feed.activity.actor_business.address + ' offer a new promotion',

                }
            }

        }
        return response;


    }
}

export default FeedConverter;