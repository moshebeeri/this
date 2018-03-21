const noPic = require('../../images/client_1.png');
import FormUtils from "../utils/fromUtils";
import strings from "../i18n/i18n"

class FeedConverter {
    createFeed(feed, savedInstancesIds,redeemedInstancesIds) {
        let response = {};
        if (feed.activity.business) {
            response = this.createBusinessUo(feed);
        }
        if (feed.activity.post) {
            return this.createActivityPost(feed);
        }
        if (feed
                .activity
                .action
            ===
            'welcome'
        ) {
            response = {
                name: feed.activity.user.name,
                message: strings.WelcomeMessage,
                itemType: 'WELCOME',
                id: feed._id,
                fid: feed._id,
                key: feed._id,
                activityId: feed.activity._id,
            }
        }
        if (feed.activity.action === 'group_message' || feed.activity.action === 'group_follow') {
            response = this.createMessageUi(feed);
        }
        if (feed.activity.action === 'instance' || feed.activity.action === 'follower_eligible_by_proximity' ||
            feed.activity.action === 'eligible_by_proximity' || feed.activity.action === 'eligible' ||
            feed.activity.action === 'eligible_on_activity_follow') {
            return this.createPromotionInstance(feed, savedInstancesIds,redeemedInstancesIds);
        }
        if (feed.activity.action === 'share') {
            return this.createShared(feed);
            ;
        }
        return response;
    }

    createActivityPost(feed) {
        let responseFeed = {
            itemType: 'POST',
            feed: feed,
            id: feed.activity.post._id,
            fid: feed._id,
            activityId: feed.activity._id,
            blocked: feed.activity.blocked,
            generalId: feed.activity.post._id,
            entities: [{post: feed.activity.post._id}],
        }
        responseFeed.sharable = feed.activity.sharable;
        if (feed.activity.post.pictures && feed.activity.post.pictures[0]) {
            responseFeed.banner = {
                uri: feed.activity.post.pictures[0].pictures[1]
            };
        }
        if (feed.activity.post.video) {
            responseFeed.video = feed.activity.post.video.url;
        }
        if (feed.activity.post.url && FormUtils.youtube_parser(feed.activity.post.url)) {
            responseFeed.videoId = FormUtils.youtube_parser(feed.activity.post.url)
        }
        if (feed.activity.post.social_state) {
            responseFeed.social = feed.activity.post.social_state;
            responseFeed.social.activityId = feed.activity._id;
        }
        let user = feed.activity.actor_user;
        if (!user) {
            user = feed.activity.post.creator;
        }
        if (user && user.pictures && Object.keys(user.pictures).length > 0) {
            responseFeed.avetar = {
                uri: user.pictures[Object.keys(user.pictures).length - 1].pictures[3]
            }
        }
        else {
            responseFeed.avetar = noPic
        }
        responseFeed.name = user.name
        if (feed.activity.post.client) {
            responseFeed.uploading = feed.activity.post.client.uploading;
        }
        return responseFeed;
    }

    createPost(post) {
        let responseFeed = {
            itemType: 'POST',
            id: post._id,
            generalId: post._id,
            entities: [{post: post._id}],
            feed:post
        }
        if (post.pictures && post.pictures[0]) {
            responseFeed.banner = {
                uri: post.pictures[0].pictures[1]
            };
        }
        if (post.social_state) {
            responseFeed.social = post.social_state;
        }
        if (post.video) {
            responseFeed.video = feed.activity.post.video.url;
        }
        if (post.url && FormUtils.youtube_parser(feed.activity.post.url)) {
            responseFeed.videoId = FormUtils.youtube_parser(feed.activity.post.url)
        }
        responseFeed.title = post.title;
        let user = post.creator;
        if (post.social_state) {
            responseFeed.social = post.social_state;
        }
        if (user && user.pictures && Object.keys(user.pictures).length > 0) {
            responseFeed.avetar = {
                uri: user.pictures[Object.keys(user.pictures).length - 1].pictures[3]
            }
        }
        else {
            responseFeed.avetar = noPic
        }
        responseFeed.name = user.name
        if (post.client) {
            responseFeed.uploading = post.client.uploading
        } else {
            responseFeed.uploading = true;
        }
        return responseFeed;
    }

    createShared(feed) {
        let response = {}
        let sharedFeed = {
            activity: feed.activity.activity,
        }
        if (feed.activity.activity.instance) {
            sharedFeed._id = feed.activity.activity.instance._id;
        }
        if (feed.activity.activity.post) {
            sharedFeed._id = feed.activity.activity.post._id;
        }
        response.shardeActivity = this.createFeed(sharedFeed);
        response.user = feed.activity.actor_user;
        response.itemType = 'SHARE';
        response.fid = feed._id,
            response.shared = response.shardeActivity.itemType;
        response.id = response.shardeActivity.id;
        response.activityId = feed.activity._id;
        response.blocked = feed.activity.blocked;
        return response;
    }

    createMessageUi(feed) {
        let response;
        let user = feed.activity.actor_user;
        if (!user) {
            user = feed.activity.user;
        }
        if (!user) {
            return undefined;
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
            response.description = strings.JoinGroupMessage;
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
        };
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
                itemTitle:  strings.businessCreated.formatUnicorn(name) ,
                name: feed.activity.business.name,
                address: feed.activity.business.address,
                website: feed.activity.business.website,
                activityId: feed.activity._id,
                email: feed.activity.business.email,
                city: feed.activity.business.city,
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
                city: feed.activity.business.city,
                address: feed.activity.business.address,
                website: feed.activity.business.website,
                email: feed.activity.business.email,
                activityId: feed.activity._id,
                social: socialState,
                name: feed.activity.business.name,
                actor: feed.activity.actor_user._id,
                itemTitle: strings.businessCreated.formatUnicorn(name) ,
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
        response.business = feed.activity.business;
        let user = feed.activity.actor_user;

        if (user && user.pictures && Object.keys(user.pictures).length > 0) {
            response.avetar = {
                uri: user.pictures[Object.keys(user.pictures).length - 1].pictures[3]
            }
        }
        else {
            response.avetar = noPic
        }

        return response;
    }

    createSavedPromotion(feed, id, isRealized) {
        let instance = feed.instance;
        let promotion = instance.promotion;
        let responseFeed = {};
        try {
            responseFeed.id = id;
            responseFeed.isRealized = isRealized;
            responseFeed.fid = id;
            responseFeed.key = id;
            responseFeed.promotionItem = promotion;
            responseFeed.location = instance.location;
            responseFeed.name = instance.promotion.name;
            responseFeed.description = instance.promotion.description;
            let date = new Date(instance.promotion.end);
            responseFeed.endDate = date.toLocaleDateString();
            responseFeed.created = instance.promotion.created;
            responseFeed.generalId = instance.promotion._id;
            responseFeed.entities = [{promotion: instance.promotion._id}];
            if (promotion.pictures && promotion.pictures[0]) {
                responseFeed.banner = {
                    uri: promotion.pictures[0].pictures[1]
                };
            }
            if (promotion.entity && promotion.entity.business) {
                responseFeed.business = promotion.entity.business;
            }
            switch (instance.type) {
                case "REDUCED_AMOUNT":
                    responseFeed.itemTitle = strings.ReduceAmountTitle.formatUnicorn(promotion.reduced_amount.values[0].price, promotion.reduced_amount.values[0].pay);
                    responseFeed.promotionTerm = strings.ReduceAmountTerms.formatUnicorn(promotion.reduced_amount.values[0].price, promotion.reduced_amount.values[0].pay);
                    responseFeed.promotion = 'REDUCED_AMOUNT';
                    responseFeed.promotionTitle = strings.ReduceAmountPromotionTitle;
                    responseFeed.promotionColor = '#e65100';
                    responseFeed.quantity = promotion.reduced_amount.quantity;
                    responseFeed.promotionValue = promotion.reduced_amount.values[0].pay;
                    break;
                case "PERCENT":
                    if (promotion.condition.product) {
                        responseFeed.itemTitle = strings.PercentWithTerm.formatUnicorn(promotion.condition.product.name, promotion.percent.values[0]);
                        responseFeed.promotionTerm = strings.PercentTermWithTerm.formatUnicorn(promotion.condition.product.name, promotion.percent.values[0]);
                    } else {
                        //responseFeed.itemTitle = "Get " + promotion.percent.values[0] + ' % Off ';
                        responseFeed.promotionTerm = strings.NoTerms.formatUnicorn(promotion.percent.values[0])
                    }
                    responseFeed.promotion = 'PERCENT';
                    responseFeed.promotionValue = promotion.percent.values[0];
                    responseFeed.promotionTitle = strings.Discount;
                    responseFeed.promotionColor = '#df80ff';
                    responseFeed.quantity = promotion.percent.quantity;
                    break;
                case "X_FOR_Y":
                    responseFeed.itemTitle = strings.XForYTitlePattern.formatUnicorn(promotion.x_for_y.values[0].eligible, promotion.condition.product.name, promotion.x_for_y.values[0].pay);
                    responseFeed.promotion = 'X_FOR_Y';
                    responseFeed.promotionColor = '#ff66b3';
                    responseFeed.promotionTitle = strings.XForYTitle;
                    responseFeed.promotionValue = promotion.x_for_y.values[0].pay;
                    responseFeed.promotionTerm = strings.XForYTitlePattern.formatUnicorn(promotion.x_for_y.values[0].eligible, promotion.condition.product.name, promotion.x_for_y.values[0].pay);
                    responseFeed.quantity = promotion.x_for_y.quantity;
                    break;
                case "X+N%OFF":
                    if (promotion.x_plus_n_percent_off.values[0].product) {
                        responseFeed.itemTitle = strings.XNOFFTitlePattern.formatUnicorn(promotion.condition.product.name, promotion.x_plus_n_percent_off.values[0].product.name, promotion.x_plus_n_percent_off.values[0].eligible);
                    }
                    responseFeed.promotion = 'X+N%OFF';
                    responseFeed.promotionColor = '#ff66b3';
                    responseFeed.quantity = promotion.x_plus_n_percent_off.quantity;
                    responseFeed.promotionTitle = strings.XNOFFTitle;
                    responseFeed.promotionValue = promotion.x_plus_n_percent_off.values[0].eligible;
                    if (promotion.x_plus_n_percent_off.values[0].product) {
                        responseFeed.promotionTerm = strings.XNOFFTitlePattern.formatUnicorn(promotion.condition.product.name, promotion.x_plus_n_percent_off.values[0].product.name, promotion.x_plus_n_percent_off.values[0].eligible);
                    }
                    break;
                case "X+Y":
                    if (promotion.x_plus_y.values[0].product) {
                        responseFeed.itemTitle = strings.XYPattern.formatUnicorn(promotion.x_plus_y.values[0].buy, promotion.condition.product.name, promotion.x_plus_y.values[0].eligible, promotion.x_plus_y.values[0].product.name);
                        responseFeed.promotionTerm = strings.XYPattern.formatUnicorn(promotion.x_plus_y.values[0].buy, promotion.condition.product.name, promotion.x_plus_y.values[0].eligible, promotion.x_plus_y.values[0].product.name);
                    }
                    responseFeed.promotion = 'X+Y';
                    responseFeed.promotionTitle = strings.XYTitle;
                    responseFeed.promotionValue = promotion.x_plus_y.values[0].buy + ' + ' + promotion.x_plus_y.values[0].eligible;
                    responseFeed.promotionColor = '#66ff1a';
                    responseFeed.quantity = promotion.x_plus_y.quantity;
                    break;
                case "HAPPY_HOUR":
                    if (promotion.happy_hour && promotion.happy_hour.values && promotion.happy_hour.values[0]) {
                        responseFeed.itemTitle = '';
                        responseFeed.promotionTitle = strings.HappyHour;
                        let days = FormUtils.convertDaysNumToString(promotion.happy_hour.values[0].days);
                        let fromHour = FormUtils.secondsFromMidnightToString(promotion.happy_hour.values[0].from);
                        let tooHour = FormUtils.secondsFromMidnightToString(promotion.happy_hour.values[0].until);
                        let productName = promotion.condition.product.name;
                        responseFeed.promotionTerm = strings.HappyHourTerm.formatUnicorn(days[0], fromHour, tooHour, productName);
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
                    responseFeed.promotionTerm = strings.punchCardTerm.formatUnicorn(punches, promotion.condition.product.name);;
                    responseFeed.itemTitle = '';
                    responseFeed.promotionTitle = strings.punchCardTerm.formatUnicorn(punches, promotion.condition.product.name);
                    responseFeed.punches = punches;
                    responseFeed.quantity = promotion.punch_card.quantity;
                    responseFeed.promotion = 'PUNCH_CARD';
                    responseFeed.promotionColor = '#d279a6';
                    responseFeed.realizedPunches = feed.savedData.punch_card.redeemTimes.length;
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
                responseFeed.businessAddress = instance.promotion.entity.business.city + ' ' + instance.promotion.entity.business.address;
                responseFeed.categoryTitle = instance.promotion.entity.business.categoryTitle;
            }
            responseFeed.itemType = 'PROMOTION';
        } catch (error) {
            console.log('error');
        }
        return responseFeed;
    }

    getInstance(feed) {
        if (feed.activity && feed.activity.instance) {
            return feed.activity.instance;
        }
        return feed;
    }

    getPromotion(feed) {
        if (feed.activity && feed.activity.instance) {
            return feed.activity.promotion;
        }
        return feed.promotion;
    }

    createPromotionInstance(feed, savedInstancesIds,redeemedInstancesIds) {
        if (!savedInstancesIds) {
            savedInstancesIds = [];
        }
        let instance = this.getInstance(feed);
        if (!instance) {
            return;
        }
        let promotion = this.getPromotion(feed);
        if (!promotion) {
            return;
        }
        let responseFeed = {};
        try {
            let date = new Date(promotion.end);
            responseFeed.id = instance._id;
            responseFeed.fid = feed._id;
            responseFeed.key = feed._id;

            if (feed.activity) {
                responseFeed.activityId = feed.activity._id;
                responseFeed.sharable = feed.activity.sharable;
                responseFeed.blocked = feed.activity.blocked;
            }
            responseFeed.promotionEntity = promotion;
            responseFeed.location = instance.location;
            responseFeed.generalId = instance._id;
            responseFeed.uploading = true;
            responseFeed.entities = [{instance: instance._id}];
            if (instance.social_state) {
                responseFeed.social = instance.social_state
                responseFeed.social.activityId = feed.activity._id;
                responseFeed.showsave = !instance.social_state.saved && !instance.social_state.realized && !savedInstancesIds.includes(instance._id);
            }
            if(redeemedInstancesIds && redeemedInstancesIds.includes(instance._id)){
                responseFeed.isRealized = true;
            }

            responseFeed.endDate = date.toLocaleDateString();
            responseFeed.created = instance.promotion.created;
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
                    responseFeed.itemTitle = strings.ReduceAmountTitle.formatUnicorn(promotion.reduced_amount.values[0].price, promotion.reduced_amount.values[0].pay);
                    responseFeed.promotionTerm = strings.ReduceAmountTerms.formatUnicorn(promotion.reduced_amount.values[0].price, promotion.reduced_amount.values[0].pay);
                    responseFeed.promotion = 'REDUCED_AMOUNT';
                    responseFeed.promotionTitle = strings.ReduceAmountPromotionTitle;
                    responseFeed.promotionColor = '#e65100';
                    responseFeed.quantity = promotion.reduced_amount.quantity;
                    responseFeed.promotionValue = promotion.reduced_amount.values[0].pay;
                    break;
                case "PERCENT":
                    if (promotion.condition.product) {
                        responseFeed.itemTitle = strings.PercentWithTerm.formatUnicorn(promotion.condition.product.name, promotion.percent.values[0]);
                        responseFeed.promotionTerm = strings.PercentTermWithTerm.formatUnicorn(promotion.condition.product.name, promotion.percent.values[0]);
                    } else {
                        responseFeed.itemTitle = "Get " + promotion.percent.values[0] + ' % Off ';
                        responseFeed.promotionTerm = strings.NoTerms.formatUnicorn(promotion.percent.values[0])
                    }
                    responseFeed.promotion = 'PERCENT';
                    responseFeed.promotionValue = promotion.percent.values[0];
                    responseFeed.promotionTitle = strings.Discount;
                    responseFeed.promotionColor = '#df80ff';
                    responseFeed.quantity = promotion.percent.quantity;
                    break;
                case "X_FOR_Y":
                    responseFeed.itemTitle = strings.XForYTitlePattern.formatUnicorn(promotion.x_for_y.values[0].eligible, promotion.condition.product.name, promotion.x_for_y.values[0].pay);
                    responseFeed.promotion = 'X_FOR_Y';
                    responseFeed.promotionColor = '#ff66b3';
                    responseFeed.promotionTitle = strings.XForYTitle;
                    responseFeed.promotionValue = promotion.x_for_y.values[0].pay;
                    responseFeed.promotionTerm = strings.XForYTitlePattern.formatUnicorn(promotion.x_for_y.values[0].eligible, promotion.condition.product.name, promotion.x_for_y.values[0].pay);
                    responseFeed.quantity = promotion.x_for_y.quantity;
                    break;
                case "X+N%OFF":
                    if (promotion.x_plus_n_percent_off.values[0].product) {
                        responseFeed.itemTitle = strings.XNOFFTitlePattern.formatUnicorn(promotion.condition.product.name, promotion.x_plus_n_percent_off.values[0].product.name, promotion.x_plus_n_percent_off.values[0].eligible);
                    }
                    responseFeed.promotion = 'X+N%OFF';
                    responseFeed.promotionColor = '#ff66b3';
                    responseFeed.quantity = promotion.x_plus_n_percent_off.quantity;
                    responseFeed.promotionTitle = strings.XNOFFTitle;
                    responseFeed.promotionValue = promotion.x_plus_n_percent_off.values[0].eligible;
                    if (promotion.x_plus_n_percent_off.values[0].product) {
                        responseFeed.promotionTerm = strings.XNOFFTitlePattern.formatUnicorn(promotion.condition.product.name, promotion.x_plus_n_percent_off.values[0].product.name, promotion.x_plus_n_percent_off.values[0].eligible);
                    }
                    break;
                case "X+Y":
                    if (promotion.x_plus_y.values[0].product) {
                        responseFeed.itemTitle = strings.XYPattern.formatUnicorn(promotion.x_plus_y.values[0].buy, promotion.condition.product.name, promotion.x_plus_y.values[0].eligible, promotion.x_plus_y.values[0].product.name);
                        responseFeed.promotionTerm = strings.XYPattern.formatUnicorn(promotion.x_plus_y.values[0].buy, promotion.condition.product.name, promotion.x_plus_y.values[0].eligible, promotion.x_plus_y.values[0].product.name);
                    }
                    responseFeed.promotion = 'X+Y';
                    responseFeed.promotionTitle = strings.XYTitle;
                    responseFeed.promotionValue = promotion.x_plus_y.values[0].buy + ' + ' + promotion.x_plus_y.values[0].eligible;
                    responseFeed.promotionColor = '#66ff1a';
                    responseFeed.quantity = promotion.x_plus_y.quantity;
                    break;
                case "HAPPY_HOUR":
                    if (promotion.happy_hour && promotion.happy_hour.values) {
                        responseFeed.itemTitle = '';
                        responseFeed.promotionTitle = strings.HappyHour;
                        let days = FormUtils.convertDaysNumToString(promotion.happy_hour.values[0].days);
                        let fromHour = FormUtils.secondsFromMidnightToString(promotion.happy_hour.values[0].from);
                        let tooHour = FormUtils.secondsFromMidnightToString(promotion.happy_hour.values[0].until);
                        let productName = promotion.condition.product.name;
                        responseFeed.promotionTerm = strings.HappyHourTerm.formatUnicorn(days[0], fromHour, tooHour, productName);
                        responseFeed.promotionValue = promotion.happy_hour.values[0].pay;
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
                    responseFeed.promotionTerm = strings.punchCardTerm.formatUnicorn(punches, promotion.condition.product.name);
                    responseFeed.itemTitle = '';
                    responseFeed.promotionTitle = strings.punchCardTerm.formatUnicorn(punches, promotion.condition.product.name);
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
        if (promotion.pictures && promotion.pictures.length > 0) {
            response.banner = {
                uri: promotion.pictures[0].pictures[1]
            };
        }
        response.uploading = true;
        response.promotionEntity = promotion;
        let date = new Date(promotion.end);
        response.endDate = date.toLocaleDateString();
        response.businessAddress = promotion.entity.business.city + ' ' + promotion.entity.business.address;
        switch (type) {
            case "REDUCED_AMOUNT":
                response.itemTitle = strings.ReduceAmountTitle.formatUnicorn(promotion.reduced_amount.values[0].price, promotion.reduced_amount.values[0].pay);
                response.promotionTerm = strings.ReduceAmountTerms.formatUnicorn(promotion.reduced_amount.values[0].price, promotion.reduced_amount.values[0].pay);
                response.promotion = 'REDUCED_AMOUNT';
                response.promotionTitle = strings.ReduceAmountPromotionTitle;
                response.promotionColor = '#e65100';
                response.quantity = promotion.reduced_amount.quantity;
                response.promotionValue = promotion.reduced_amount.values[0].pay;
                break;
            case "PERCENT":
                if (promotion.condition.product) {
                    response.itemTitle = strings.PercentWithTerm.formatUnicorn(promotion.condition.product.name, promotion.percent.values[0]);
                    response.promotionTerm = strings.PercentTermWithTerm.formatUnicorn(promotion.condition.product.name, promotion.percent.values[0]);
                } else {
                    response.itemTitle = "Get " + promotion.percent.values[0] + ' % Off ';
                    response.promotionTerm = strings.NoTerms.formatUnicorn(promotion.percent.values[0])
                }
                response.promotion = 'PERCENT';
                response.promotionValue = promotion.percent.values[0];
                response.promotionTitle = strings.Discount;
                response.promotionColor = '#df80ff';
                response.quantity = promotion.percent.quantity;
                break;
            case "X_FOR_Y":
                response.itemTitle = strings.XForYTitlePattern.formatUnicorn(promotion.x_for_y.values[0].eligible, promotion.condition.product.name, promotion.x_for_y.values[0].pay);
                response.promotion = 'X_FOR_Y';
                response.promotionColor = '#ff66b3';
                response.promotionTitle = strings.XForYTitle;
                response.promotionValue = promotion.x_for_y.values[0].pay;
                response.promotionTerm = strings.XForYTitlePattern.formatUnicorn(promotion.x_for_y.values[0].eligible, promotion.condition.product.name, promotion.x_for_y.values[0].pay);
                response.quantity = promotion.x_for_y.quantity;
                break;
            case "X+N%OFF":
                if (promotion.x_plus_n_percent_off.values[0].product) {
                    response.itemTitle = strings.XNOFFTitlePattern.formatUnicorn(promotion.condition.product.name, promotion.x_plus_n_percent_off.values[0].product.name, promotion.x_plus_n_percent_off.values[0].eligible);
                }
                response.promotion = 'X+N%OFF';
                response.promotionColor = '#ff66b3';
                response.quantity = promotion.x_plus_n_percent_off.quantity;
                response.promotionTitle = strings.XNOFFTitle;
                response.promotionValue = promotion.x_plus_n_percent_off.values[0].eligible;
                if (promotion.x_plus_n_percent_off.values[0].product) {
                    response.promotionTerm = strings.XNOFFTitlePattern.formatUnicorn(promotion.condition.product.name, promotion.x_plus_n_percent_off.values[0].product.name, promotion.x_plus_n_percent_off.values[0].eligible);
                }
                break;
            case "X+Y":
                if (promotion.x_plus_y.values[0].product) {
                    response.itemTitle = strings.XYPattern.formatUnicorn(promotion.x_plus_y.values[0].buy, promotion.condition.product.name, promotion.x_plus_y.values[0].eligible, promotion.x_plus_y.values[0].product.name);
                    response.promotionTerm = strings.XYPattern.formatUnicorn(promotion.x_plus_y.values[0].buy, promotion.condition.product.name, promotion.x_plus_y.values[0].eligible, promotion.x_plus_y.values[0].product.name);
                }
                response.promotion = 'X+Y';
                response.promotionTitle = strings.XYTitle;
                response.promotionValue = promotion.x_plus_y.values[0].buy + ' + ' + promotion.x_plus_y.values[0].eligible;
                response.promotionColor = '#66ff1a';
                response.quantity = promotion.x_plus_y.quantity;
                break;
            case "HAPPY_HOUR":
                if (promotion.happy_hour && promotion.happy_hour.values && promotion.happy_hour.values[0]) {
                    response.itemTitle = '';
                    response.promotionTitle = strings.HappyHour;
                    let days = FormUtils.convertDaysNumToString(promotion.happy_hour.values[0].days);
                    let fromHour = FormUtils.secondsFromMidnightToString(promotion.happy_hour.values[0].from);
                    let tooHour = FormUtils.secondsFromMidnightToString(promotion.happy_hour.values[0].until);
                    let productName = promotion.condition.product.name;
                    response.promotionTerm = strings.HappyHourTerm.formatUnicorn(days[0], fromHour, tooHour, productName);
                    response.promotionValue = promotion.happy_hour.values[0].pay;
                    response.quantity = promotion.happy_hour.quantity;
                    response.promotion = 'HAPPY_HOUR';
                    response.promotionColor = '#d279a6';
                } else {
                    return undefined;
                }
                break;
            case "PUNCH_CARD":
                let punches = promotion.punch_card.values[0].number_of_punches;
                response.promotionTerm = strings.punchCardTerm.formatUnicorn(punches, promotion.condition.product.name);;
                response.itemTitle = '';
                response.promotionTitle = strings.punchCardTerm.formatUnicorn(punches, promotion.condition.product.name);
                response.punches = punches;
                response.quantity = promotion.punch_card.quantity;
                response.promotion = 'PUNCH_CARD';
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