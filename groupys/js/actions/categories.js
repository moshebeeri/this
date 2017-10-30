import * as actions from "../reducers/reducerActions";

export function fetchCategories(gid,categoryApi) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        dispatch({
            type: actions.CATEGORIES_FETCHING,

        });
        let response = await categoryApi(gid)
        dispatch({
            type: actions.CATEGORIES_FETCHING_DONE,

        });

    }
}



export function resetForm() {
    return function (dispatch) {
        dispatch({
            type: actions.CATEGORIES_FETCHING_DONE,
        });
    }
}
