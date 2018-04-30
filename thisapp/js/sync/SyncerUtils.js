import asyncListener from "../api/AsyncListeners";
import * as types from '../saga/sagaActions';
import getStore from "../store";

const store = getStore();

function addMyBusinessSync(businessId) {
    let dispatch = store.dispatch;
    let state = store.getState();
    asyncListener.addListener("business_" + businessId, (snap) => {
        let response = snap.val();
        if (response) {
            const token = state.authentication.token;
            dispatch({
                type: types.UPDATE_BUSINESS_REQUEST,
                token: token,
            })
        }
    });
}

function addGroupChatSync(groupId) {
    let dispatch = store.dispatch;
    let state = store.getState();
    asyncListener.addListener("group_chat_" + groupId, (snap) => {
        let response = snap.val();
        if (response && !response.markAsRead) {
            let groupId = snap.key.substring('group_chat_'.length);
            const token = state.authentication.token;
            const groupsChats = state.comments.groupComments[groupId];
            const user = state.user.user;
            if (groupsChats) {
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
                    group: groupId,
                    token: token,
                    lastChatId: groupChatIds[0],
                    user: user,
                })
            }
            dispatch({
                type: types.SAVE_GROUPS_REQUEST,
                token: token,
            });
            asyncListener.markAsRead(snap.key);
        }
    });
}

function addChatSync(generalId, entity) {
    let dispatch = store.dispatch;
    let state = store.getState();
    asyncListener.addListener('instanceMessage_' + generalId, (snap) => {
        let response = snap.val();
        if (response && !response.markAsRead) {
            const token = state.authentication.token;
            let entities = [];
            entities.push(entity);
            let entitiesComents = state.entityComments.entityCommentsOrder[generalId];
            if (entitiesComents) {
                dispatch({
                    type: types.FEED_SYNC_CHAT,
                    entities: entities,
                    token: token,
                    generalId: generalId,
                    lastChatId: entitiesComents[0]
                })
            } else {
                dispatch({
                    type: types.FEED_SYNC_CHAT,
                    entities: entities,
                    token: token,
                    generalId: generalId,
                    lastChatId: 0
                })
            }
            asyncListener.markAsRead(snap.key);
        }
    })
}

function syncGroup(groupId) {
    let dispatch = store.dispatch;
    let state = store.getState();
    //sync group chat
    addGroupChatSync(groupId);
    //sync group view
    asyncListener.addListener('user_follow_group_' + groupId, (snap) => {
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
    asyncListener.addListener('feed_' + groupId, (snap) => {
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

function syncSocialState(entity) {
    let dispatch = store.dispatch;
    let state = store.getState();
    // sync social
    asyncListener.addListener('social_' + entity, (snap) => {
        let response = snap.val();
        if (response && !response.markAsRead) {
            let instanceId = snap.key.substring('social_'.length);
            const token = state.authentication.token;
            dispatch({
                type: types.FEED_SET_SOCIAL_STATE,
                token: token,
                id: instanceId
            });
            asyncListener.markAsRead(snap.key);
        }
    })
    asyncListener.addListener('Redeem' + entity, (snap) => {
        let response = snap.val();
        if (response && !response.markAsRead) {
            let instanceId = snap.key.substring('Redeem'.length);
            const token = state.authentication.token;
            dispatch({
                type: types.FEED_SET_SOCIAL_STATE,
                token: token,
                id: instanceId
            });
            asyncListener.markAsRead(snap.key);
        }
    })
}

function syncPromotion(promotionId) {
    let dispatch = store.dispatch;
    let state = store.getState();
    asyncListener.addListener('promotion_' + promotionId, (snap) => {
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

function invokeEntityCommentSendEvent(generalId, message, state) {
    invokeSocialChange(generalId, state);
    asyncListener.syncChange('instanceMessage_' + generalId, message);
}

function invokeSocialChange(generalId, state) {
    asyncListener.syncChange('social_' + generalId, "addComment");
    if (state.instances.instances[id] && state.instances.instances[id].promotion) {
        asyncListener.syncChange('promotion_' + state.instances.instances[id].promotion, 'like');
    }
}

export default {
    addGroupChatSync,
    addChatSync,
    addMyBusinessSync,
    syncGroup,
    syncSocialState,
    syncPromotion,
    invokeEntityCommentSendEvent,
    invokeSocialChange
}
