const noPic = require('../../images/client_1.png');
import FormUtils from "../utils/fromUtils";

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
        let socialState = {
            like: false,
            numberLikes: 0,
            follow: 0,
            shares: 0,
            share: false,
        }
        if (feed.activity.business.social_state) {
            socialState = feed.activity.business.social_state;
        }
        if (feed.activity.business.pictures && feed.activity.business.pictures[0]) {
            response = {
                id: feed.activity.business._id,
                fid: feed._id,
                key: feed._id,
                social: socialState,
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
                social: socialState,
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
        response.businessLogo = feed.activity.business.logo;
        response.categoryTitle = feed.activity.business.categoryTitle;
        response.businessName = feed.activity.business.name;
        response.location = feed.activity.business.location;
        return response;
    }

    createSavedPomotion(feed, id, extraData) {
        let instance = feed.instance;
        let responseFeed = {};
        try {
            responseFeed.id = id;
            responseFeed.fid = id;
            responseFeed.key = id;
            responseFeed.name = instance.promotion.name;
            responseFeed.description = instance.promotion.description;
            let date = new Date(instance.promotion.end);
            responseFeed.endDate = date.toLocaleDateString();
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
                    if (instance.promotion.x_plus_n_percent_off.values && instance.promotion.x_plus_n_percent_off.values[0] && instance.promotion.x_plus_n_percent_off.values[0].product) {
                        responseFeed.itemTitle = 'Buy ' + instance.promotion.condition.product.name + " Get " + instance.promotion.x_plus_n_percent_off.values[0].product.name + " with " + instance.promotion.x_plus_n_percent_off.values[0].eligible + " %Off";
                        responseFeed.promotion = 'X+N%OFF';
                        responseFeed.promotionColor = '#ff66b3';
                    } else {
                        return undefined;
                    }
                    break;
                case "X+Y":
                    responseFeed.itemTitle = 'Buy ' + instance.promotion.x_plus_y.values[0].buy + " " + instance.promotion.condition.product.name + " Get " + instance.promotion.x_plus_y.values[0].eligible + " " + instance.promotion.x_plus_y.values[0].product.name;
                    responseFeed.promotion = 'X+Y';
                    responseFeed.promotionColor = '#66ff1a';
                    break;
                case "PUNCH_CARD":
                    if (extraData || extraData === 0) {
                        responseFeed.itemTitle = 'Number of punches ' + extraData + ' / ' + instance.promotion.punch_card.values[0].number_of_punches;
                        responseFeed.promotion = 'PUNCH CARD';
                        responseFeed.promotionColor = '#d279a6';
                    } else {
                        responseFeed.itemTitle = 'Number of punches ' + instance.promotion.punch_card.values[0].number_of_punches;
                        responseFeed.promotion = 'PUNCH CARD';
                        responseFeed.promotionColor = '#d279a6';
                    }
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
                responseFeed.categoryTitle = instance.promotion.entity.business.categoryTitle;
                responseFeed.businessAddress = instance.promotion.entity.business.city + ' ' + instance.promotion.entity.business.address;
            } else {
                responseFeed.businessName = instance.promotion.entity.business.name;
                responseFeed.businessAddress = finstance.promotion.entity.business.city + ' ' + instance.promotion.entity.business.address;
                responseFeed.categoryTitle = instance.promotion.entity.business.categoryTitle;
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
        if (!instance) {
            return;
        }
        let promotion = this.getPromotion(feed);
        let responseFeed = {};
        try {
            let date = new Date(promotion.end);
            responseFeed.id = instance._id;
            responseFeed.fid = feed._id;
            responseFeed.key = feed._id;
            responseFeed.location = instance.location;
            responseFeed.generalId = instance._id;
            responseFeed.entities = [{instance: instance._id}];
            if (instance.social_state) {
                responseFeed.social = instance.social_state
                responseFeed.showsave = !instance.social_state.saved && !instance.social_state.realized;
            }
            responseFeed.shareable = !instance.shareable;
            responseFeed.endDate = date.toLocaleDateString();
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
                    responseFeed.promotionTerm = "Purchase " + promotion.reduced_amount.values[0].price + " Pay only " + promotion.reduced_amount.values[0].pay;
                    responseFeed.promotion = 'REDUCED_AMOUNT';
                    responseFeed.promotionTitle = 'Reduce Amount';
                    responseFeed.promotionColor = '#e65100';
                    responseFeed.quantity = promotion.reduced_amount.quantity;
                    responseFeed.promotionValue = promotion.reduced_amount.values[0].pay;
                    break;
                case "PERCENT":
                    if (promotion.condition.product) {
                        responseFeed.itemTitle = "Get " + promotion.condition.product.name + " with " + promotion.percent.values[0] + ' % Off ';
                        responseFeed.promotionTerm = "Get " + promotion.condition.product.name + " with " + promotion.percent.values[0] + ' % Off ';
                    } else {
                        responseFeed.itemTitle = "Get " + promotion.percent.values[0] + ' % Off ';
                        responseFeed.promotionTerm = "No terms"
                    }
                    responseFeed.promotion = 'PERCENT';
                    responseFeed.promotionValue = promotion.percent.values[0];
                    responseFeed.promotionTitle = 'Discount';
                    responseFeed.promotionColor = '#df80ff';
                    responseFeed.quantity = promotion.percent.quantity;
                    break;
                case "X_FOR_Y":
                    responseFeed.itemTitle = 'Buy ' + promotion.x_for_y.values[0].eligible + " " + promotion.condition.product.name + " Pay only " + promotion.x_for_y.values[0].pay;
                    responseFeed.promotion = 'X_FOR_Y';
                    responseFeed.promotionColor = '#ff66b3';
                    responseFeed.promotionTitle = 'Buy X For Y';
                    responseFeed.promotionValue = promotion.x_for_y.values[0].pay;
                    responseFeed.promotionTerm = 'Buy ' + promotion.x_for_y.values[0].eligible + " " + promotion.condition.product.name + " Pay only " + promotion.x_for_y.values[0].pay;
                    responseFeed.quantity = promotion.x_for_y.quantity;
                    break;
                case "X+N%OFF":
                    if (promotion.x_plus_n_percent_off.values[0].product) {
                        responseFeed.itemTitle = 'Buy ' + promotion.condition.product.name + " Get " + promotion.x_plus_n_percent_off.values[0].product.name + " with " + promotion.x_plus_n_percent_off.values[0].eligible + " %Off";
                    }
                    responseFeed.promotion = 'X+N%OFF';
                    responseFeed.promotionColor = '#ff66b3';
                    responseFeed.quantity = promotion.x_plus_n_percent_off.quantity;
                    responseFeed.promotionTitle = 'Buy X get Y with Discount';
                    responseFeed.promotionValue = promotion.x_plus_n_percent_off.values[0].eligible;
                    if (promotion.x_plus_n_percent_off.values[0].product) {
                        responseFeed.promotionTerm = 'Buy ' + promotion.condition.product.name + " Get " + promotion.x_plus_n_percent_off.values[0].product.name + " with " + promotion.x_plus_n_percent_off.values[0].eligible + " %Off";
                    }
                    break;
                case "X+Y":
                    if (promotion.x_plus_y.values[0].product) {
                        responseFeed.itemTitle = 'Buy ' + promotion.x_plus_y.values[0].buy + " " + promotion.condition.product.name + " Get " + promotion.x_plus_y.values[0].eligible + " " + promotion.x_plus_y.values[0].product.name;
                        responseFeed.promotionTerm = 'Buy ' + promotion.x_plus_y.values[0].buy + " " + promotion.condition.product.name + " Get " + promotion.x_plus_y.values[0].eligible + " " + promotion.x_plus_y.values[0].product.name + ' free';
                    }
                    responseFeed.promotion = 'X+Y';
                    responseFeed.promotionTitle = 'Buy X get Y';
                    responseFeed.promotionValue = promotion.x_plus_y.values[0].buy + ' + ' + promotion.x_plus_y.values[0].eligible;
                    responseFeed.promotionColor = '#66ff1a';
                    responseFeed.quantity = promotion.x_plus_y.quantity;
                    break;
                case "HAPPY_HOUR":
                    if (promotion.happy_hour && promotion.happy_hour.values) {
                        responseFeed.itemTitle = '';
                        responseFeed.promotionTitle = "Happy Hour";
                        responseFeed.promotionTerm = "Every " + FormUtils.convertDaysNumToString(promotion.happy_hour.values[0].days) + " happy hour from " +
                            FormUtils.secondsFromMidnightToString(promotion.happy_hour.values[0].from) + "-" + FormUtils.secondsFromMidnightToString(promotion.happy_hour.values[0].from + promotion.happy_hour.values[0].until) +
                            " get special price for " + promotion.condition.product.name
                        responseFeed.promotionValue = promotion.happy_hour.values[0].pay;
                        responseFeed.quantity = promotion.happy_hour.quantity;
                        responseFeed.promotion = 'HAPPY_HOUR';
                        responseFeed.promotionColor = '#d279a6';
                    } else {
                        return undefined;
                    }
                    break;
                case "PUNCH_CARD":
                    let punches = promotion.punch_card.values[0].number_of_punches;
                    responseFeed.promotionTerm = punches;
                    responseFeed.itemTitle = '';
                    responseFeed.promotionTitle = "Punch Card " + punches + " Slots";
                    responseFeed.punches = punches;
                    responseFeed.quantity = promotion.punch_card.quantity;
                    responseFeed.promotion = 'PUNCH_CARD';
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
        response.endDate = date.toLocaleDateString();
        response.businessAddress = promotion.entity.business.city + ' ' + promotion.entity.business.address;
        switch (type) {
            case "REDUCED_AMOUNT":
                response.itemTitle = "Buy For " + promotion.reduced_amount.values[0].price + ' Pay Only ' + promotion.reduced_amount.values[0].pay;
                response.promotionTerm = "Purchase " + promotion.reduced_amount.values[0].price;
                response.promotion = 'REDUCED AMOUNT';
                response.promotionTitle = 'Reduce Amount';
                response.promotionColor = '#e65100';
                response.quantity = promotion.reduced_amount.quantity;
                response.promotionValue = promotion.reduced_amount.values[0].pay;
                break;
            case "PERCENT":
                if (promotion.condition.product) {
                    response.itemTitle = "Get " + promotion.condition.product.name + " with " + promotion.percent.values[0] + ' % Off ';
                    response.promotionTerm = "Get " + promotion.condition.product.name + " with " + promotion.percent.values[0] + ' % Off ';
                } else {
                    response.itemTitle = "Get " + promotion.percent.values[0] + ' % Off ';
                    response.promotionTerm = "No terms"
                }
                response.promotion = 'PERCENT';
                response.promotionValue = promotion.percent.values[0];
                response.promotionTitle = 'Discount';
                response.promotionColor = '#df80ff';
                response.quantity = promotion.percent.quantity;
                break;
            case "X_FOR_Y":
                response.itemTitle = 'Buy ' + promotion.x_for_y.values[0].eligible + " " + promotion.condition.product.name + " Pay only " + promotion.x_for_y.values[0].pay;
                response.promotion = 'X FOR Y';
                response.promotionColor = '#ff66b3';
                response.promotionTitle = 'Buy X For Y';
                response.promotionValue = promotion.x_for_y.values[0].pay;
                response.promotionTerm = 'Buy ' + promotion.x_for_y.values[0].eligible + " " + promotion.condition.product.name + " Pay only " + promotion.x_for_y.values[0].pay;
                response.quantity = promotion.x_for_y.quantity;
                break;
            case "X+N%OFF":
                response.itemTitle = 'Buy ' + promotion.condition.product.name + " Get " + promotion.x_plus_n_percent_off.values[0].product.name + " with " + promotion.x_plus_n_percent_off.values[0].eligible + " %Off";
                response.promotion = 'X+N%OFFf';
                response.promotionColor = '#ff66b3';
                response.quantity = promotion.x_plus_n_percent_off.quantity;
                response.promotionTitle = 'Buy X get Y with Discount';
                response.promotionValue = promotion.x_plus_n_percent_off.values[0].eligible;
                response.promotionTerm = 'Buy ' + promotion.condition.product.name + " Get " + promotion.x_plus_n_percent_off.values[0].product.name + " with " + promotion.x_plus_n_percent_off.values[0].eligible + " %Off";
                break;
            case "X+Y":
                response.itemTitle = 'Buy ' + promotion.x_plus_y.values[0].buy + " " + promotion.condition.product.name + " Get " + promotion.x_plus_y.values[0].eligible + " " + promotion.x_plus_y.values[0].product.name;
                response.promotion = 'X+Y';
                response.promotionTitle = 'Buy X get Y';
                response.promotionTerm = 'Buy ' + promotion.x_plus_y.values[0].buy + " " + promotion.condition.product.name + " Get " + promotion.x_plus_y.values[0].eligible + " " + promotion.x_plus_y.values[0].product.name + ' free';
                response.promotionValue = promotion.x_plus_y.values[0].buy + ' + ' + promotion.x_plus_y.values[0].eligible;
                response.promotionColor = '#66ff1a';
                response.quantity = promotion.x_plus_y.quantity;
                break;
            case "HAPPY_HOUR":
                if (promotion.happy_hour && promotion.happy_hour.values && promotion.happy_hour.values.length > 0) {
                    response.itemTitle = '';
                    response.promotionTitle = "Happy Hour";
                    response.promotionTerm = "Every " + FormUtils.convertDaysNumToString(promotion.happy_hour.values[0].days) + " happy hour from " +
                        FormUtils.secondsFromMidnightToString(promotion.happy_hour.values[0].from) + " until " + FormUtils.secondsFromMidnightToString(promotion.happy_hour.values[0].from + promotion.happy_hour.values[0].until) +
                        " get special price for " + promotion.condition.product.name
                    response.promotionValue = promotion.happy_hour.values[0].pay;
                    response.quantity = promotion.happy_hour.quantity;
                    response.promotion = 'HAPPY HOUR';
                    response.promotionColor = '#d279a6';
                } else {
                    return undefined;
                }
                break;
            case "PUNCH_CARD":
                let punches = promotion.punch_card.values[0].number_of_punches
                response.itemTitle = '';
                response.promotionTitle = "Punch Card " + punches + " Slots";
                response.punches = punches;
                response.quantity = promotion.punch_card.quantity;
                response.promotion = 'PUNCH CARD';
                response.promotionColor = '#d279a6';
                break;
            default:
                return undefined;
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