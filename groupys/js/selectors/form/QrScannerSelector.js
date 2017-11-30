import {createSelector} from 'reselect'
import FeedUiConverter from "../../api/feed-ui-converter";

let feedUiConverter = new FeedUiConverter();
const getQrcodeInstance = (state) => state.scannerForm;
export const getInstance = createSelector([getQrcodeInstance],
    (qrcode) => {
        if (!qrcode.instance || !qrcode.instance.instance) {
            return undefined;
        }
        let extraData
        switch (qrcode.instance.instance.type) {
            case "PUNCH_CARD":
                extraData = qrcode.instance.savedData.punch_card.redeemTimes.length;
                break;

        }
        let promotion = feedUiConverter.createSavedPromotion(qrcode.instance,0,extraData);
        return promotion;
    })