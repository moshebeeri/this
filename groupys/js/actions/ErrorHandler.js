import * as errors from '../api/Errors'
import * as actions from "../reducers/reducerActions";
const handleError  = (error,dispatch) => {
    if(error === errors.NETWORK_ERROR) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
    }
};

export default {

    handleError
};