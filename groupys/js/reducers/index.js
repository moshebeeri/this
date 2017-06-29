/**
 * Created by stan229 on 5/27/16.
 */
import { combineReducers } from "redux";
import feeds from "./feedReducer";
import businesses from "./businessReducer";
import groups from "./groupReducer";
import promotions from './promotionReducer';
import products from './productReducer';
import user from './UserReducer';
export default function getRootReducer() {

    return combineReducers({
        feeds: feeds,
        businesses: businesses,
        groups:groups,
        promotions: promotions,
        products:products,
        user:user
    });
}
