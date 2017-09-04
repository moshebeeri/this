/**
 * Created by roilandshut on 08/06/2017.
 */
import { createStore, applyMiddleware } from "redux";

import thunk from "redux-thunk";
import {AsyncStorage} from 'react-native'
import getRootReducer from "./reducers";
import {persistStore, autoRehydrate} from 'redux-persist'

const store = createStore(
    getRootReducer(),
    undefined,
    applyMiddleware(thunk),
    autoRehydrate()
);
persistStore(store ,{storage: AsyncStorage});

export default function getStore() {


    return store;
}