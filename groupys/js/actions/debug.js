import * as actions from "../reducers/reducerActions";

export function resetMessag() {
    return function (dispatch) {
        dispatch({
            type: actions.TIME_OUT,
            debugMessage: ''
        });
    }
}
