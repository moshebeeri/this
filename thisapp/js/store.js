/**
 * Created by roilandshut on 08/06/2017.
 */
import {applyMiddleware, createStore, compose} from "redux";
import thunk from "redux-thunk";
import {AsyncStorage} from 'react-native'
import getRootReducer from "./reducers";
import createSagaMiddleware from 'redux-saga'
import {autoRehydrate, persistStore} from 'redux-persist'
import {createLogger} from 'redux-logger'
import saga from './saga/saga'
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

// const initialState = {};
// const middlewares = [thunk, sagaMiddleware];
// const storeMoshe = createStore(
//     getRootReducer(),
//     initialState,
//     compose(
//         applyMiddleware(...middlewares),
//         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//     ),
//     autoRehydrate(),
// );



persistStore(store, {storage: AsyncStorage});

sagaMiddleware.run(saga)
export default function getStore() {
    return store;
}

