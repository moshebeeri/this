/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {entityRoles:{}, selectedUsers: [], users: {}, userPictures:[],followers: [], user: undefined, saving: false};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";

export default function user(state = initialState, action) {
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.user,saving: false
        };
    }
    let userState = {...state};
    let currentUsers = userState.users;
    switch (action.type) {
        case actions.UPSERT_SINGLE_USER:
            currentUsers[action.item._id] = action.item;
            return userState;
        case actions.SET_USER_ENTITY_ROLES:
            userState.entityRoles[action.entityId] = action.roles;
            return userState;
        case actions.UPSERT_USER:
            action.item.forEach(eventItem => {
                currentUsers[eventItem._id] = eventItem;
            });
            return userState;
        case  actions.SET_USER:
            return {
                ...state,
                user: action.user,
            };
        case actions.USER_FOLLOW:
            return {
                ...state,
                followers: action.followers,
            };
        case actions.USER_SELECT:
            userState.selectedUsers.push(action.user)
            return userState;
        case actions.USER_UNSELECT:
            return userState;
        case actions.SAVING_USER:
            return {
                ...state,
                saving: true,
            };
        case actions.SAVING_USER_DONE:
            return {
                ...state,
                saving: false,
            };
        case actions.USER_SELECT_RESET:
            return {
                ...state,
                selectedUsers: new Array(),
                saving: false,
            };
        case actions.USERS_UPLOAD_PIC:
            let pictures =userState.userPictures;
            pictures.push(action.item);
            return {
                ...state,
                userPictures: pictures,
            };
        case actions.CLEAR_USERS_UPLOAD_PIC:
             return {
                ...state,
                userPictures: [],
            };


        default:
            return state;
    }
};
/**
 * Created by roilandshut on 13/06/2017.
 */
