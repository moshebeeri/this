import {createSelector} from 'reselect'
import FeedUiConverter from "../../api/feed-ui-converter";
import InstanceLifeCycle from '../../utils/InstanceLifeCycle'

let feedUiConverter = new FeedUiConverter();
const getQrcodeInstance = (state) => state.scannerForm;
const getStateFeeds = (state) => state.myPromotions
export const getInstance = createSelector([getQrcodeInstance,getStateFeeds],
    (qrcode,myPromotions) => {
        if (!qrcode.instance || !qrcode.instance.instance) {
            return undefined;
        }
        let extraData
        switch (qrcode.instance.instance.type) {
            case "PUNCH_CARD":
                extraData = qrcode.instance.savedData.punch_card.redeemTimes.length;
                break;

        }
        let instanceLifeCycle = new InstanceLifeCycle(myPromotions.feeds);
        let promotion = feedUiConverter.createSavedPromotion(qrcode.instance,0,instanceLifeCycle,extraData);
        return promotion;
    })