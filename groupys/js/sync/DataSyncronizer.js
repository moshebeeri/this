import getStore from "../store";
import asyncListener from "../api/AsyncListeners";
import * as types from '../sega/segaActions';

const store = getStore();

class DataSync {
    syncData() {
        //sync group chats
        this.syncGroupChat(store.getState().groups.groups, store.getState(), store.dispatch);
        this.syncInstanceSocial(store.getState().instances.instances, store.getState(), store.dispatch);
    }

    syncInstanceSocial(instances, state, dispatch) {
        if (Object.values(instances)) {
            Object.values(instances).forEach(instance => {
                    asyncListener.addListener('social_' + instance._id, (snap) => {
                        let instanceId = snap.key.substring('social_'.length);
                        const token = state.authentication.token;
                        let feedInstance = state.instances.instances[instanceId];
                        dispatch({
                            type: types.FEED_SET_SOCIAL_STATE,
                            token: token,
                            feed: feedInstance,
                            id: instanceId
                        });
                    })
                    asyncListener.addListener('instanceMessage_' + instance._id, (snap) => {
                        let instanceId = snap.key.substring('instanceMessage_'.length);
                        const token = state.authentication.token;
                        let entities = [];
                        entities.push({instance: instance._id});
                        let entitiesComents = state.entityComments.entityCommentsOrder[instanceId];
                        if (entitiesComents) {
                            dispatch({
                                type: types.FEED_SYNC_CHAT,
                                entities: entities,
                                token: token,
                                generalId: instanceId,
                                lastChatId: entitiesComents[0]
                            })
                        } else {
                            dispatch({
                                type: types.FEED_SYNC_CHAT,
                                entities: entities,
                                token: token,
                                generalId: instanceId,
                                lastChatId: 0
                            })
                        }
                    })
                }
            )
        }
    }

    syncGroupChat(groups, state, dispatch) {
        if (Object.values(groups)) {
            Object.values(groups).forEach(group => {
                    asyncListener.addListener(group._id, (snap) => {
                        let groupId = snap.key;
                        const token = state.authentication.token;
                        const groupsChats = state.comments.groupComments[groupId];
                        const user = state.user.user;
                        if (groupsChats) {
                            this.setChatTop(groupsChats, groupId, user, token, dispatch)
                        }
                    })
                }
            )
        }
    }

    setChatTop(groupsChats, group, user, token, dispatch) {
        let groupChatIds = Object.keys(groupsChats).sort(function (a, b) {
            if (a < b) {
                return 1
            }
            if (a > b) {
                return -1
            }
            return 0;
        });
        dispatch({
            type: types.GROUP_SYNC_CHAT,
            group: group,
            token: token,
            lastChatId: groupChatIds[0],
            user: user,
        })
    }
}

const dataSync = new DataSync();
export default dataSync;