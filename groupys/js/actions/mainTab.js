import * as actions from "../reducers/reducerActions";
export function changeTab(newTab) {
    return function (dispatch, getState) {
        dispatch({
            type: actions.APP_CHANGE_TAB,
            selectedTab: newTab.i
        });
    }
}
export function showFab(showAdd) {
    return function (dispatch, getState) {
        dispatch({
            type: actions.APP_SHOW_ADD_FAB,
            showAdd: showAdd
        });
    }
}
