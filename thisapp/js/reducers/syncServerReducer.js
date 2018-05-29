const initialState = {
    syncMessages: {},
    socialState: [],
    groups: [],
    businesses: [],
    promotions: [],
    chats: {},
    chatsGroups: {},
    chatsGroupInstance: {}
};
import * as actions from './reducerActions';
import {REHYDRATE} from 'redux-persist/constants'

export default function syncServer(state = initialState, action) {
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.syncServer
        };
    }
    let syncServerState = {...state};
    switch (action.type) {
        case actions.SOCIAL_STATE_LISTENER:
            if (!syncServerState.socialState.includes(action.id)) {
                syncServerState.socialState.push(action.id);
            }
            return syncServerState;
        case actions.GROUP_LISTENER:
            if (!syncServerState.groups.includes(action.id)) {
                syncServerState.groups.push(action.id);
            }
            return syncServerState;
        case actions.PROMOTION_LISTENER:
            if (!syncServerState.promotions.includes(action.id)) {
                syncServerState.promotions.push(action.id);
            }
            return syncServerState;
        case actions.BUSINESS_LISTENER:
            if (!syncServerState.businesses.includes(action.id)) {
                syncServerState.businesses.push(action.id);
            }
            return syncServerState;
        case actions.BUSINESS_PROMOTINS_LISTENER:
            if (!syncServerState.promotions.includes(action.id)) {
                syncServerState.promotions.push(action.id);
            }
            return syncServerState;
        case actions.CHAT_LISTENER:
            if (!syncServerState.chats[action.id]) {
                syncServerState.chats[action.id] = action.entities;
            }
            return syncServerState;
        case actions.CHAT_LISTENER_GROUP:
            if (!syncServerState.chatsGroups[action.groupId]) {
                syncServerState.chatsGroups[action.groupId] = {};
            }
            if (!syncServerState.chatsGroups[action.groupId][action.id]) {
                syncServerState.chatsGroups[action.groupId][action.id] = action.entities;
            }
            return syncServerState;
        case actions.CHAT_LISTENER_GROUP_INSTANCE:
            if (!syncServerState.chatsGroupInstance[action.groupId]) {
                syncServerState.chatsGroupInstance[action.groupId] = [];
            }
            if (!syncServerState.chatsGroupInstance[action.groupId].includes(action.id)) {
                syncServerState.chatsGroupInstance[action.groupId].push(action.id);
            }
            return syncServerState;
        case actions.SYNC_MESSAGE:
            syncServerState.syncMessages[action.id] = action.lastMessage;
            return syncServerState;
        default:
            return state;
    }
};