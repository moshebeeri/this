
import * as actions from '../reducers/reducerActions';


export function selectUser(index){
    return function (dispatch){
        dispatch({
            type: actions.USER_SELECT,
            userIndex:user
        });
    }

}
export function unselectUser(index){
    return function (dispatch){
        dispatch({
            type: actions.USER_UNSELECT,
            userIndex:index
        });
    }

}

export function resetForm(){
    return function (dispatch){
        dispatch({
            type: actions.USER_SELECT_RESET,
        });
    }

}
