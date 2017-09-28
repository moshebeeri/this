const noPic = require('../../images/client_1.png');
class FeedConverter {
    createFeed(feed) {
        let response = {};
        if (feed.activity.business) {
            response = this.createBusinessUo(feed);
        }
        if (feed.activity.action === 'welcome') {
            response = {
                name: feed.activity.user.name,
                message: 'Thank you for joining THIS,' +
                ' im a few minute you would start to receive Promotion',
                itemType: 'WELCOME',
                id: feed._id,
                fid: feed._id,
                key: feed._id,
            }
        }
        if (feed.activity.action === 'group_message' || feed.activity.action === 'group_follow') {
            response = this.createMessageUi(feed);
        }
        if (feed.activity.action === 'instance' || feed.activity.action === 'eligible') {
            return this.createPromontionInstance(feed);
        }
        return response;
    }

     createMessageUi(feed) {
        let response;
        let user = feed.activity.actor_user;
        if (!user) {
            user = feed.activity.user;
        }
        let name = user.phone_number;
        if (user.name) {
            name = user.name;
        }
        response = {
            id: feed._id,
            fid: feed._id,
            key: feed._id,
            actor: user._id,
            showSocial: false,
            description: feed.activity.message,
            date: feed.activity.timestamp
        };
        if (user.pictures && user.pictures.length > 0) {
            response.logo = {
                uri: user.pictures[user.pictures.length - 1].pictures[0]
            }
        } else {
            response.logo = noPic;
        }
        response.name = name;
        if (feed.activity.action === 'group_follow') {
            response.description = "jonied the group";
        }
        response.itemType = 'MESSAGE';
        return response;
    }

    createBusinessUo(feed) {
        let response = {};
        if (!feed.activity.actor_user) {
            return undefined;
        }
        let name = feed.activity.actor_user.name;
        if (!name) {
            name = feed.activity.actor_user.phone_number;
        }
        if (feed.activity.business.pictures && feed.activity.business.pictures[0]) {
            response = {
                id: feed.activity.business._id,
                fid: feed._id,
                key: feed._id,
                social: {
                    like: feed.activity.actor_user.social_state.like,
                    numberLikes: feed.activity.actor_user.social_state.likes,
                    follow: feed.activity.actor_user.social_state.follow,
                    shares: feed.activity.actor_user.social_state.shares
                },
                actor: feed.activity.actor_user._id,
                itemTitle: name + ' ' + feed.activity.action,
                name: feed.activity.business.name,
                businessAddress: feed.activity.business.city + ' ' + feed.activity.business.address,
                banner: {
                    uri: feed.activity.business.pictures[0].pictures[0]
                },
                showSocial: true,
            }
        } else {
            response = {
                id: feed.activity.business._id,
                fid: feed._id, key: feed._id,
                social: {
                    like: feed.activity.actor_user.social_state.like,
                    numberLikes: feed.activity.actor_user.social_state.likes,
                    follow: feed.activity.actor_user.social_state.follow,
                    shares: feed.activity.actor_user.social_state.shares
                },
                name: feed.activity.business.name,
                actor: feed.activity.actor_user._id,
                itemTitle: name + ' ' + feed.activity.action,
                businessAddress: feed.activity.business.city + ' ' + feed.activity.business.address,
                showSocial: true,
            }
        }
        response.generalId = feed.activity.business._id;
        response.entities = [{business: feed.activity.business._id}];
        response.itemType = 'BUSINESS';
        return response;
    }

    createSavedPomotion(feed) {
        let instance = feed.instance;
        let responseFeed = {};
        try {
            responseFeed.id = instance._id;
            responseFeed.fid = instance.gid;
            responseFeed.key = instance.gid;
            responseFeed.name = instance.promotion.name;
            responseFeed.description = instance.promotion.description;
            let date = new Date(instance.promotion.end);
            responseFeed.endDate = date.toDateString();
            responseFeed.generalId = instance.promotion._id;
            responseFeed.entities = [{promotion: instance.promotion._id}];
            switch (instance.type) {
                case "REDUCED_AMOUNT":
                    responseFeed.itemTitle = "Buy For " + instance.promotion.reduced_amount.values[0].price + ' Pay Only ' + instance.promotion.reduced_amount.values[0].pay;
                    responseFeed.promotion = 'REDUCE AMOUNT';
                    responseFeed.promotionColor = '#e65100';
                    break;
                case "PERCENT":
                    if (instance.promotion.condition.product) {
                        responseFeed.itemTitle = "Get " + instance.promotion.condition.product.name + " with " + instance.promotion.percent.values[0] + ' % Off ';
                    } else {
                        responseFeed.itemTitle = "Get " + instance.promotion.percent.values[0] + ' % Off ';
                    }
                    responseFeed.promotion = 'PRECENT';
                    responseFeed.promotionColor = '#df80ff';
                    break;
                case "X_FOR_Y":
                    responseFeed.itemTitle = 'Buy ' + instance.promotion.x_for_y.values[0].eligible + " " + instance.promotion.condition.product.name + " Pay only " + instance.promotion.x_for_y.values[0].pay;
                    responseFeed.promotion = 'X_FOR_Y';
                    responseFeed.promotionColor = '#ff66b3';
                    break;
                case "X+N%OFF":
                    responseFeed.itemTitle = 'Buy ' + instance.promotion.condition.product.name + " Get " + instance.promotion.x_plus_n_percent_off.values[0].product.name + " with " + instance.promotion.x_plus_n_percent_off.values[0].eligible + " %Off";
                    responseFeed.promotion = 'X+N%OFF';
                    responseFeed.promotionColor = '#ff66b3';
                    break;
                case "X+Y":
                    responseFeed.itemTitle = 'Buy ' + instance.promotion.x_plus_y.values[0].buy + " " + instance.promotion.condition.product.name + " Get " + instance.promotion.x_plus_y.values[0].eligible + " " + instance.promotion.x_plus_y.values[0].product.name;
                    responseFeed.promotion = 'X+Y';
                    responseFeed.promotionColor = '#66ff1a';
                    break;
                case "PUNCH_CARD":
                    responseFeed.itemTitle = '';
                    responseFeed.promotion = 'PUNCH CARD';
                    responseFeed.promotionColor = '#d279a6';
                    break;
                default:
                    responseFeed.itemTitle = instance.type + " NOT SUPPORTED";
                    responseFeed.promotion = instance.type;
                    responseFeed.promotionColor = 'black';
                    break;
            }
            if (instance.promotion.entity && instance.promotion.entity.business.pictures.length > 0) {
                responseFeed.businessLogo = instance.promotion.entity.business.pictures[0].pictures[0];
                responseFeed.businessName = instance.promotion.entity.business.name;
                responseFeed.businessAddress = instance.promotion.entity.business.city + ' ' + instance.promotion.entity.business.address;
            } else {
                responseFeed.businessName = instance.promotion.entity.business.name;
                responseFeed.businessAddress = finstance.promotion.entity.business.city + ' ' + instance.promotion.entity.business.address;
            }
            responseFeed.itemType = 'PROMOTION';
        } catch (error) {
            console.log('error');
        }
        return responseFeed;
    }

     getInstance(feed) {
        if (feed.activity) {
            return feed.activity.instance;
        }
        return feed;
    }

     getPromotion(feed) {
        if (feed.activity) {
            return feed.activity.promotion;
        }
        return feed.promotion;
    }

    createPromontionInstance(feed) {
        let instance = this.getInstance(feed);
        let promotion = this.getPromotion(feed);
        let responseFeed = {};
        try {
            let date = new Date(promotion.end);
            responseFeed.id = instance._id;
            responseFeed.fid = feed._id;
            responseFeed.key = feed._id;
            responseFeed.generalId = promotion._id;
            responseFeed.entities = [{promotion: promotion._id}];
            if (instance.social_state) {
                responseFeed.social = {
                    like: instance.social_state.like,
                    numberLikes: instance.social_state.likes,
                    follow: instance.social_state.follow,
                    saved: instance.social_state.saved,
                    activityId: feed.activity._id,
                    realized: instance.social_state.realized,
                    use: instance.social_state.use,
                    share: instance.social_state.share,
                    shares: instance.social_state.shares
                };
                responseFeed.showsave = !instance.social_state.saved && !instance.social_state.realized;
            }
            responseFeed.shareable = !instance.shareable;
            responseFeed.endDate = date.toDateString();
            responseFeed.name = promotion.name;
            responseFeed.description = promotion.description;
            responseFeed.showSocial = true;
            if (promotion.pictures && promotion.pictures[0]) {
                responseFeed.banner = {
                    uri: promotion.pictures[0].pictures[1]
                };
            }
            switch (instance.type) {
                case "REDUCED_AMOUNT":
                    responseFeed.itemTitle = "Buy For " + promotion.reduced_amount.values[0].price + ' Pay Only ' + promotion.reduced_amount.values[0].pay;
                    responseFeed.promotion = 'REDUCED AMOUNT';
                    responseFeed.promotionColor = '#e65100';
                    break;
                case "PERCENT":
                    if (promotion.condition.product) {
                        responseFeed.itemTitle = "Get " + promotion.condition.product.name + " with " + promotion.percent.values[0] + ' % Off ';
                    } else {
                        responseFeed.itemTitle = "Get " + promotion.percent.values[0] + ' % Off ';
                    }
                    responseFeed.promotion = 'PERCENT';
                    responseFeed.promotionColor = '#df80ff';
                    break;
                case "X_FOR_Y":
                    responseFeed.itemTitle = 'Buy ' + promotion.x_for_y.values[0].eligible + " " + promotion.condition.product.name + " Pay only " + promotion.x_for_y.values[0].pay;
                    responseFeed.promotion = 'X FOR Y';
                    responseFeed.promotionColor = '#ff66b3';
                    break;
                case "X+N%OFF":
                    responseFeed.itemTitle = 'Buy ' + promotion.condition.product.name + " Get " + promotion.x_plus_n_percent_off.values[0].product.name + " with " + promotion.x_plus_n_percent_off.values[0].eligible + " %Off";
                    responseFeed.promotion = 'X+N%OFFf';
                    responseFeed.promotionColor = '#ff66b3';
                    break;
                case "X+Y":
                    responseFeed.itemTitle = 'Buy ' + promotion.x_plus_y.values[0].buy + " " + promotion.condition.product.name + " Get " + promotion.x_plus_y.values[0].eligible + " " + promotion.x_plus_y.values[0].product.name;
                    responseFeed.promotion = 'X+Y';
                    responseFeed.promotionColor = '#66ff1a';
                    break;
                case "PUNCH_CARD":
                    responseFeed.itemTitle = '';
                    responseFeed.promotion = 'PUNCH CARD';
                    responseFeed.promotionColor = '#d279a6';
                    break;
                default:
                    responseFeed.itemTitle = instance.type + " NOT SUPPORTED";
                    responseFeed.promotion = instance.type;
                    responseFeed.promotionColor = 'black';
                    break;
            }
            if (promotion.entity && promotion.entity.business && promotion.entity.business.pictures && promotion.entity.business.pictures[0]) {
                responseFeed.businessLogo = promotion.entity.business.pictures[0].pictures[3];
                responseFeed.businessName = promotion.entity.business.name;
                responseFeed.businessAddress = promotion.entity.business.city + ' ' + promotion.entity.business.address;
            }
            if (promotion.entity && promotion.entity.business) {
                responseFeed.business = promotion.entity.business;
            }
            responseFeed.itemType = 'PROMOTION';
        } catch (error) {
            console.log('error');
        }
        return responseFeed;
    }

     createPromotionAttributes(promotion, type) {
        let response = {};
        response.name = promotion.name;
        response.description = promotion.description;
        if (promotion.pictures.length > 0) {
            response.banner = {
                uri: promotion.pictures[0].pictures[1]
            };
        }
        let date = new Date(promotion.end);
        response.endDate = date.toDateString();
        response.businessAddress = promotion.entity.business.city + ' ' + promotion.entity.business.address;
        switch (type) {
            case "REDUCED_AMOUNT":
                response.itemTitle = "Buy For " + promotion.reduced_amount.values[0].price + ' Pay Only ' + promotion.reduced_amount.values[0].pay;
                response.promotion = 'REDUCED AMOUNT';
                response.promotionColor = '#e65100';
                response.quantity = 'Total ' + promotion.reduced_amount.quantity;
                break;
            case "PERCENT":
                if (promotion.condition.product) {
                    response.itemTitle = "Get " + promotion.condition.product.name + " with " + promotion.percent.values[0] + ' % Off ';
                } else {
                    response.itemTitle = "Get " + promotion.percent.values[0] + ' % Off ';
                }
                response.promotion = 'PERCENT';
                response.promotionColor = '#df80ff';
                response.quantity = 'Total ' + promotion.percent.quantity;
                break;
            case "X_FOR_Y":
                response.itemTitle = 'Buy ' + promotion.x_for_y.values[0].eligible + " " + promotion.condition.product.name + " Pay only " + promotion.x_for_y.values[0].pay;
                response.promotion = 'X FOR Y';
                response.promotionColor = '#ff66b3';
                response.quantity = 'Total ' + promotion.x_for_y.quantity;
                break;
            case "X+N%OFF":
                response.itemTitle = 'Buy ' + promotion.condition.product.name + " Get " + promotion.x_plus_n_percent_off.values[0].product.name + " with " + promotion.x_plus_n_percent_off.values[0].eligible + " %Off";
                response.promotion = 'X+N%OFFf';
                response.promotionColor = '#ff66b3';
                response.quantity = 'Total ' + promotion.x_plus_n_percent_off.quantity;
                break;
            case "X+Y":
                response.itemTitle = 'Buy ' + promotion.x_plus_y.values[0].buy + " " + promotion.condition.product.name + " Get " + promotion.x_plus_y.values[0].eligible + " " + promotion.x_plus_y.values[0].product.name;
                response.promotion = 'X+Y';
                response.promotionColor = '#66ff1a';
                response.quantity = 'Total ' + promotion.x_plus_y.quantity;
                break;
            case "PUNCH_CARD":
                response.itemTitle = '';
                response.promotion = 'PUNCH CARD';
                response.promotionColor = '#d279a6';
                break;
            default:
                response.itemTitle = instance.type + " NOT SUPPORTED";
                response.promotion = instance.type;
                response.promotionColor = 'black';
                break;
        }
        return response
    }

     createMessage(user, message) {
        let currentTime = new Date().toLocaleString();
        let response = {
            id: 100,
            fid: 101,
            actor: user._id,
            showSocial: false,
            description: message,
            date: currentTime,
        };
        if (user.pictures && user.pictures.length > 0) {
            response.logo = {
                uri: user.pictures[user.pictures.length - 1].pictures[0]
            }
        } else {
            response.logo = noPic;
        }
        response.userMessage = true;
        response.name = user.name;
        response.itemType = 'MESSAGE';
        return response;
    }
}
export default FeedConverter;