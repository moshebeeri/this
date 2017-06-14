/**
 * Created by stan229 on 5/27/16.
 */
import { combineReducers } from "redux";
import feeds from "./feedReducer";
import businesses from "./businessReducer";
import groups from "./groupReducer";
import promotions from './promotionReducer';
export default function getRootReducer() {

    return combineReducers({
        feeds: feeds,
        businesses: businesses,
        groups:groups,
        promotions: promotions

    });
}
