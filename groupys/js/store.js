/**
 * Created by roilandshut on 08/06/2017.
 */
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import {AsyncStorage} from 'react-native'
import getRootReducer from "./reducers";
import createSagaMiddleware from 'redux-saga'
import {autoRehydrate, persistStore} from 'redux-persist'
import {createLogger} from 'redux-logger'
import sega from './sega/sega'
const logger = createLogger({

    // ...options
});

const sagaMiddleware =  createSagaMiddleware();

const store = createStore(
    getRootReducer(),
    applyMiddleware(sagaMiddleware),
    applyMiddleware(thunk),
    autoRehydrate(),

);


persistStore(store, {storage: AsyncStorage});

sagaMiddleware.run(sega)
export default function getStore() {
    return store;
}

