const initialState = {
    entityComments: {},
    entityCommentsOrder: {},
    clientMessages: {},
    loadingDone: {},
    showTopLoader: {},
    update: false,
    lastCall: {}
};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";
export default function entityComments(state = initialState, action) {
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.entityComments
        };
    }
    let currentState = {...state};
    let clientMessage = currentState.clientMessages;
    let entitiesComments = currentState.entityComments;
    switch (action.type) {
        case actions.UPSERT_ENTITIES_COMMENT :
            if (!entitiesComments[action.generalId]) {
                entitiesComments[action.generalId] = {}
            }
            entitiesComments[action.generalId][action.item._id] = action.item;
            if (!currentState.entityCommentsOrder[action.generalId]) {
                currentState.entityCommentsOrder[action.generalId] = [];
            }
            if (currentState.entityCommentsOrder[action.generalId].includes(action.item._id)) {
                return state
            }
            currentState.entityCommentsOrder[action.generalId].push(action.item._id);
            currentState.update = !currentState.update;
            return currentState;
        case actions.UPSERT_ENTITIES_TOP_COMMENT :
            if (!entitiesComments[action.generalId]) {
                entitiesComments[action.generalId] = {}
            }
            entitiesComments[action.generalId][action.item._id] = action.item;
            if (!currentState.entityCommentsOrder[action.generalId]) {
                currentState.entityCommentsOrder[action.generalId] = [];
            }
            if (currentState.entityCommentsOrder[action.generalId].includes(action.item._id)) {
                return state
            }
            currentState.entityCommentsOrder[action.generalId].unshift(action.item._id);
            currentState.update = !currentState.update;
            return currentState;
        case actions.ENTITIES_COMMENT_LOADING_DONE:
            currentState.loadingDone[action.generalId] = action.loadingDone;
            return currentState;
        case actions.ENTITIES_COMMENT_LAST_CALL:
            currentState.lastCall[action.generalId] = action.lastCall;
            return currentState;
        case actions.ENTITIES_COMMENT_SHOW_TOP_LOADER:
            currentState.showTopLoader[action.generalId] = action.showTopLoader;
            return currentState;
        case actions.ENTITIES_COMMENT_INSTANCE_ADD_MESSAGE:
            if (!clientMessage[action.generalId]) {
                clientMessage[action.generalId] = [];
            }
            clientMessage[action.generalId].push(action.message);
            return currentState;
        case actions.ENTITIES_COMMENT_INSTANCE_CLEAR_MESSAGE:
            clientMessage[action.generalId] = [];
            return currentState;
        default:
            return state;
    }
};