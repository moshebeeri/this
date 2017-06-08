/**
 * Created by stan229 on 5/27/16.
 */
import { combineReducers } from "redux";
import feeds from "./feedReducer";

export default function getRootReducer() {

    return combineReducers({
        feeds: feeds
    });
}
