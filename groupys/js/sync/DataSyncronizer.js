import getStore from "../store";
import asyncListener from "../api/AsyncListeners";
import * as types from '../sega/segaActions';

const store = getStore();

class DataSync {
    syncData() {
        //workaround  until redux stores values return from hibernate
        if (Object.values(store.getState().instances.instances).length === 0) {
            setTimeout(this.initSyncListeners.bind(this), 2000);
        } else {
            this.initSyncListeners();
        }
    }

    initSyncListeners() {
        this.syncGroups(store.getState().groups.groups, store.getState(), store.dispatch, store.getState().user.user);
        this.syncInstances(store.getState().instances.instances, store.getState(), store.dispatch);
        this.syncPromotions(store.getState().promotions.promotions, store.getState(), store.dispatch);
        this.syncMainFeed(store.getState().user.user, store.getState(), store.dispatch);
        this.syncNotification(store.getState().user.user, store.getState(), store.dispatch);
    }

    syncMainFeed(user, state, dispatch) {
        if (user) {
            asyncListener.addListener('feed_' + user._id, (snap) => {
                const token = state.authentication.token;
                const feedOrder = state.feeds.feedView;
                if (feedOrder && feedOrder.length > 0) {
                    dispatch({
                        type: types.FEED_SET_TOP_FEED,
                        lastId: feedOrder[0],
                        token: token,
                        user: user,
                    });
                }
            })
        }
    }

    syncNotification(user, state, dispatch) {
        if (user) {
            asyncListener.addListener('notification_' + user._id, (snap) => {
                const token = state.authentication.token;
                dispatch({
                    type: types.SAVE_NOTIFICATION_TOP_REQUEST,
                    token: token, user: user
                });
            })
        }
    }

    syncPromotions(promotions, state, dispatch) {
        if (Object.values(promotions)) {
            Object.values(promotions).forEach(promotion => {
                    asyncListener.addListener('promotion_' + promotion._id, (snap) => {
                        let promotionId = snap.key.substring('promotion_'.length);
                        const token = state.authentication.token;
                        let promotion = state.promotions.promotions[promotionId];
                        if (promotion) {
                            let businessId = promotion.entity.business;
                            if (state.businesses.myBusinesses[businessId]) {
                                dispatch({
                                    type: types.UPDATE_PROMOTION,
                                    token: token,
                                    id: promotionId,
                                    businessId: businessId,
                                    item: promotion
                                });
                            }
                        }
                    })
                }
            )
        }
    }

    syncInstances(instances, state, dispatch) {
        if (Object.values(instances)) {
            Object.values(instances).forEach(instance => {
                    // sync social
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
                    // sync instance comments
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

    syncGroups(groups, state, dispatch, user) {
        if (Object.values(groups)) {
            Object.values(groups).forEach(group => {
                    //sync group chat
                    asyncListener.addListener(group._id, (snap) => {
                        let groupId = snap.key;
                        const token = state.authentication.token;
                        const groupsChats = state.comments.groupComments[groupId];
                        const user = state.user.user;
                        if (groupsChats) {
                            this.setChatTop(groupsChats, groupId, user, token, dispatch)
                        }
                    });
                    //sync group view
                    asyncListener.addListener('group_' + group._id, (snap) => {
                        // TODO use get by group
                        let groupId = snap.key.substring('group_'.length);
                        const token = state.authentication.token;
                        dispatch({
                            type: types.SAVE_GROUPS_REQUEST,
                            token: token,
                        });
                    })
                    //sync group main feeds
                    asyncListener.addListener('feed_' + group._id, (snap) => {
                        const feedOrder = state.groups.groupFeedOrder[group._id];
                        const token = state.authentication.token;
                        if (feedOrder) {
                            if (feedOrder && feedOrder.length > 0) {
                                dispatch({
                                    type: types.GROUP_FEED_SET_TOP_FEED,
                                    lastId: feedOrder[0],
                                    group: group,
                                    token: token,
                                    user: user,
                                });
                                dispatch({
                                    type: types.SAVE_GROUPS_REQUEST,
                                    token: token,
                                });
                            }
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