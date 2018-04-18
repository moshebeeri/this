import getStore from "../store";
import asyncListener from "../api/AsyncListeners";
import SyncUtils from "./SyncerUtils";
import * as types from '../sega/segaActions';

const store = getStore();

class DataSync {
    syncData() {
        if (store) {
            //workaround  until redux stores values return from hibernate
            if (Object.values(store.getState().instances.instances).length === 0) {
                setTimeout(this.initSyncListeners.bind(this), 2000);
            } else {
                this.initSyncListeners();
            }
        }
    }

    initSyncListeners() {
        this.syncManage();
        this.initDataLysteners();
    }

    initDataLysteners() {
        this.syncUser(store.getState(), store.dispatch, store.getState().user.user);
        this.syncGroups(store.getState().groups.groups, store.getState(), store.dispatch, store.getState().user.user);
        this.syncBusinesses(store.getState().businesses.myBusinesses, store.getState(), store.dispatch);
        this.syncInstances(store.getState().instances.instances, store.getState(), store.dispatch);
        this.syncPromotions(store.getState().promotions.promotions, store.getState(), store.dispatch);
        this.syncMainFeed(store.getState().user.user, store.getState(), store.dispatch);
    }

    syncManage() {
        let initFunction = this.initDataLysteners.bind(this);
        asyncListener.addManagement((snap) => {
            asyncListener.reset();
            initFunction();
        })
    }

    syncUser(state, dispatch, user) {
        if (user) {
            asyncListener.addListener('user_' + user._id, (snap) => {
                let response = snap.val();
                const token = state.authentication.token;
                if (response && !response.markAsRead) {
                    switch (response.type) {
                        case "saved_instance_realized":
                            dispatch({
                                type: types.UPDATE_SINGLE_MYPROMOTIONS_REQUEST,
                                token: token,
                                savedInstanceId: response.savedInstance,
                            });
                            break;
                        case "group_policy_changed":
                        case "user_follow_group":
                        case "group_created":
                            dispatch({
                                type: types.SAVE_GROUPS_REQUEST,
                                token: token,
                            });
                            break;
                        case "notification_sent":
                            dispatch({
                                type: types.SAVE_NOTIFICATION_TOP_REQUEST,
                                token: token, user: user
                            });
                    }
                    asyncListener.markAsRead(snap.key);
                }
            })
        }
    }

    syncMainFeed(user, state, dispatch) {
        if (user) {
            asyncListener.addListener('feed_' + user._id, (snap) => {
                let response = snap.val();
                if (response && !response.markAsRead) {
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
                    asyncListener.markAsRead(snap.key);
                }
            })
        }
    }

    syncPromotions(promotions, state, dispatch) {
        if (Object.values(promotions)) {
            Object.values(promotions).forEach(promotion => {
                    asyncListener.addListener('promotion_' + promotion._id, (snap) => {
                        let response = snap.val();
                        if (response && !response.markAsRead) {
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
                            asyncListener.markAsRead(snap.key);
                        }
                    })
                }
            )
        }
    }

    syncBusinesses(businesses, state, dispatch) {
        if (Object.values(businesses)) {
            Object.values(businesses).forEach(business => {
                    SyncUtils.addBusinessSync(dispatch, state, business.business._id);
                }
            )
        }
    }

    syncInstances(instances, state, dispatch) {
        if (Object.values(instances)) {
            Object.values(instances).forEach(instance => {
                    // sync social
                    asyncListener.addListener('social_' + instance._id, (snap) => {
                        let response = snap.val();
                        if (response && !response.markAsRead) {
                            let instanceId = snap.key.substring('social_'.length);
                            const token = state.authentication.token;
                            let feedInstance = state.instances.instances[instanceId];
                            dispatch({
                                type: types.FEED_SET_SOCIAL_STATE,
                                token: token,
                                feed: feedInstance,
                                id: instanceId
                            });
                            asyncListener.markAsRead(snap.key);
                        }
                    })
                    asyncListener.addListener('Redeem' + instance._id, (snap) => {
                        let response = snap.val();
                        if (response && !response.markAsRead) {
                            let instanceId = snap.key.substring('Redeem'.length);
                            const token = state.authentication.token;
                            let feedInstance = state.instances.instances[instanceId];
                            dispatch({
                                type: types.FEED_SET_SOCIAL_STATE,
                                token: token,
                                feed: feedInstance,
                                id: instanceId
                            });
                            asyncListener.markAsRead(snap.key);
                        }
                    })
                    SyncUtils.addInstanceChatSync(dispatch, state, instance._id);
                }
            )
        }
    }

    syncGroups(groups, state, dispatch, user) {
        if (Object.values(groups)) {
            Object.values(groups).forEach(group => {
                    //sync group chat
                    SyncUtils.addGroupChatSync(dispatch, state, group._id);
                    //sync group view
                    asyncListener.addListener('user_follow_group_' + group._id, (snap) => {
                        // TODO use get by group
                        let response = snap.val();
                        if (response && !response.markAsRead) {
                            let groupId = snap.key.substring('group_'.length);
                            const token = state.authentication.token;
                            dispatch({
                                type: types.SAVE_GROUPS_REQUEST,
                                token: token,
                            });
                            asyncListener.markAsRead(snap.key);
                        }
                    })
                    //sync group main feeds
                    asyncListener.addListener('feed_' + group._id, (snap) => {
                        let response = snap.val();
                        if (response && !response.markAsRead) {
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
                            asyncListener.markAsRead(snap.key);
                        }
                    })
                }
            )
        }
    }
}

const dataSync = new DataSync();
export default dataSync;