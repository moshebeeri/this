/**
 * Created by roilandshut on 08/06/2017.
 */
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import {AsyncStorage} from 'react-native'
import getRootReducer from "./reducers";
import {autoRehydrate, persistStore} from 'redux-persist'
import {createLogger} from 'redux-logger'

const logger = createLogger({
    // ...options
});
export const store = createStore(
    getRootReducer(),
    undefined,
    applyMiddleware(thunk),
    //TODO only in developer
    applyMiddleware(logger),
    autoRehydrate()
);
persistStore(store, {storage: AsyncStorage});
export default function getStore() {
    return store;
}