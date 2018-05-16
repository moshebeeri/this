import getStore from "../store";
import asyncListener from "../api/AsyncListeners";
import SyncUtils from "./SyncerUtils";
import * as types from '../saga/sagaActions';

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
        this.syncGroups(store.getState().syncServer.groups);
        this.syncMyBusinesses(store.getState().syncServer.businesses);
        this.syncSocialState(store.getState().syncServer.socialState,);
        this.syncPromotions(store.getState().syncServer.promotions);
        this.syncChats(store.getState().syncServer.chats);
        this.syncChatsGroupInstances(store.getState().syncServer.chatsGroupInstance);
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
                        case "business_user_follow":
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
            asyncListener.addListener('business_' + user._id, (snap) => {
                const token = state.authentication.token;
                dispatch({
                    type: types.UPDATE_BUSINESS_REQUEST,
                    token: token,
                })
                asyncListener.markAsRead(snap.key);
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

    syncPromotions(promotions) {
        if (Object.values(promotions)) {
            Object.values(promotions).forEach(promotion => {
                    SyncUtils.syncPromotion(promotion);
                }
            )
        }
    }

    syncMyBusinesses(businesses) {
        if (Object.values(businesses)) {
            Object.values(businesses).forEach(business => {
                    SyncUtils.addMyBusinessSync(business);
                }
            )
        }
    }

    syncSocialState(entities) {
        if (Object.values(entities)) {
            Object.values(entities).forEach(entity => {
                    SyncUtils.syncSocialState(entity);
                }
            )
        }
    }

    syncGroups(groups) {
        if (Object.values(groups)) {
            Object.values(groups).forEach(groupId => {
                    //sync group chat
                    SyncUtils.syncGroup(groupId);
                }
            )
        }
    }

    syncChats(chats) {
        if (Object.values(chats)) {
            Object.keys(chats).forEach(chatId => {
                    //sync group chat
                    SyncUtils.addChatSync(chatId, chats[chatId]);
                }
            )
        }
    }

    syncChatsGroupInstances(chats) {
        if (Object.keys(chats)) {
            Object.keys(chats).forEach(groupId => {
                    let generalId = chats[groupId];
                    //sync group chat
                    SyncUtils.addChatGroupEntitySync(groupId, generalId);
                }
            )
        }
    }
}

const dataSync = new DataSync();
export default dataSync;