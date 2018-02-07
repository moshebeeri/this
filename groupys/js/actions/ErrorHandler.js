import * as errors from '../api/Errors'
import * as actions from "../reducers/reducerActions";
import {NavigationActions} from "react-navigation";
import store from 'react-native-simple-store';
const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName: 'login'})
    ]
});
const handleError  = (error,dispatch) => {
    if(error === errors.NETWORK_ERROR) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
    }

    if(error === errors.UN_AUTHOTIZED_ACCESS){
        store.save('token','');
        dispatch({
            type: actions.SAVE_USER_TOKEN,
            token: ''
        });
        dispatch(resetAction);

    }
};

const handleSuccses  = (reduxState, dispatch) => {
    if(reduxState.network.offline) {
        dispatch({
            type: actions.NETWORK_IS_ONLINE,
        });
    }

};

export default {

    handleError,
    handleSuccses
};