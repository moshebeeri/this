import asyncListener from "../api/AsyncListeners";
import * as types from '../saga/sagaActions';
import * as actions from '../reducers/reducerActions';
import getStore from "../store";

const store = getStore();

function addMyBusinessSync(businessId) {
    let dispatch = store.dispatch;
    let state = store.getState();
    asyncListener.addListener("business_" + businessId, (snap) => {
        let response = snap.val();
        if (response && !response.markAsRead) {
            const token = state.authentication.token;
            if (state.syncServer.syncMessages["business_" + businessId] && state.syncServer.syncMessages["business_" + businessId] === response) {
                return;
            }
            dispatch({
                type: types.UPDATE_BUSINESS_REQUEST,
                token: token,
            })
            dispatch({
                type: actions.SYNC_MESSAGE,
                id: "business_permissions" + businessId,
                lastMessage: response
            })
        }
    });
    asyncListener.addListener("business_promotions" + businessId, (snap) => {
        let response = snap.val();
        if (response && !response.markAsRead) {
            const token = state.authentication.token;
            if (state.syncServer.syncMessages["business_promotions" + businessId] && state.syncServer.syncMessages["business_promotions" + businessId] === response) {
                return;
            }
            dispatch({
                type: types.UPDATE_BUSINESS_PROMOTIONS,
                businessId: businessId,
                token: token,
            })
            dispatch({
                type: actions.SYNC_MESSAGE,
                id: "business_permissions" + businessId,
                lastMessage: response
            })
        }
    });
    asyncListener.addListener("business_permissions" + businessId, (snap) => {
        let response = snap.val();
        if (response && !response.markAsRead) {
            const token = state.authentication.token;
            if (state.syncServer.syncMessages["business_permissions" + businessId] && state.syncServer.syncMessages["business_permissions" + businessId] === response) {
                return;
            }
            dispatch({
                type: types.UPDATE_BUSINESS_PERMISSIONS,
                businessId: businessId,
                token: token,
            })
            dispatch({
                type: types.GET_USER_ENTITY_ROLES,
                entityId: businessId,
                token: token,
            })
            dispatch({
                type: actions.SYNC_MESSAGE,
                id: "business_permissions" + businessId,
                lastMessage: response
            })
        }
    });
    asyncListener.addListener("business_products" + businessId, (snap) => {
        let response = snap.val();
        if (response && !response.markAsRead) {
            const token = state.authentication.token;
            if (state.syncServer.syncMessages["business_products" + businessId] && state.syncServer.syncMessages["business_products" + businessId] === response) {
                return;
            }
            dispatch({
                type: types.UPDATE_BUSINESS_PRODUCTS,
                businessId: businessId,
                token: token,
            })
            dispatch({
                type: actions.SYNC_MESSAGE,
                id: "business_products" + businessId,
                lastMessage: response
            })
        }
    });
}

function invokeBusinessPromotionsChange(businessId) {
    asyncListener.syncChange('business_promotions' + businessId, "promotion_changed");
}

function invokeBusinessProductsChange(businessId) {
    asyncListener.syncChange('business_products' + businessId, "product_changed");
}

function invokeBusinessUserChange(businessId) {
    asyncListener.syncChange('business_permissions' + businessId, "user_changed");
}

function invokeBusinessChange(userId) {
    asyncListener.syncChange('business_' + userId, "business_changed");
}

function addGroupChatSync(groupId) {
    let dispatch = store.dispatch;
    let state = store.getState();
    asyncListener.addListener("group_chat_" + groupId, (snap) => {
        let response = snap.val();
        if (response && !response.markAsRead) {
            let groupId = snap.key.substring('group_chat_'.length);
            if (state.syncServer.syncMessages["group_chat_" + groupId] && state.syncServer.syncMessages["group_chat_" + groupId] === response) {
                return;
            }
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
                type: actions.GROUP_UNREAD_MESSAGE,
                groupId: groupId,
                message: response
            })
            dispatch({
                type: types.SAVE_GROUPS_REQUEST,
                token: token,
            });
            dispatch({
                type: actions.SYNC_MESSAGE,
                id: "group_chat_" + groupId,
                lastMessage: response
            })
        }
    });
    asyncListener.addListener("group_chat_typing_users" + groupId, (snap) => {
        let response = snap.val();
        if (response && !response.markAsRead) {
            let groupId = snap.key.substring('group_chat_typing_users'.length);
            dispatch({
                type: actions.GROUP_CHAT_TYPING,
                user: response,
                groupId: groupId
            })
        }
    });
    asyncListener.addListener('deleteMessage_' + groupId, (snap) => {
        let response = snap.val();
        if (response && !response.markAsRead) {
            const token = state.authentication.token;
            if (state.syncServer.syncMessages['deleteMessage_' + groupId] && state.syncServer.syncMessages['deleteMessage_' + groupId] === response) {
                return;
            }
            dispatch({
                type: actions.DELETE_MESSAGE,
                messageId: response,
                groupId: groupId
            });
            dispatch({
                type: types.SAVE_GROUPS_REQUEST,
                token: token,
            });
            dispatch({
                type: actions.SYNC_MESSAGE,
                id: 'deleteMessage_' + groupId,
                lastMessage: response
            })
        }
    })
}

function addChatSync(generalId, entities) {
    let dispatch = store.dispatch;
    let state = store.getState();
    asyncListener.addListener('instanceMessage_' + generalId, (snap) => {
        let response = snap.val();
        if (response && !response.markAsRead) {
            const token = state.authentication.token;
            let entitiesComents = state.entityComments.entityCommentsOrder[generalId];
            if (state.syncServer.syncMessages['instanceMessage_' + generalId] && state.syncServer.syncMessages['instanceMessage_' + generalId] === response) {
                return;
            }
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
                dispatch({
                    type: actions.SYNC_MESSAGE,
                    id: 'instanceMessage_' + generalId,
                    lastMessage: response
                })
            }
        }
    })
    asyncListener.addListener('deleteMessage_' + generalId, (snap) => {
        let response = snap.val();
        if (response && !response.markAsRead) {
            if (state.syncServer.syncMessages['deleteMessage_' + generalId] && state.syncServer.syncMessages['deleteMessage_' + generalId] === response) {
                return;
            }
            dispatch({
                type: actions.DELETE_INSTANCE_MESSAGE,
                messageId: response,
                generalId: generalId
            });
            dispatch({
                type: actions.SYNC_MESSAGE,
                id: 'deleteMessage_' + generalId,
                lastMessage: response
            })
        }
    })
}

function addChatGroupEntitySync(groupId, generalId) {
    let dispatch = store.dispatch;
    let state = store.getState();
    asyncListener.addListener('instanceMessage_' + generalId, (snap) => {
        let response = snap.val();
        if (response && !response.markAsRead) {
            const token = state.authentication.token;
            if (state.syncServer.syncMessages['instanceMessage_' + generalId] && state.syncServer.syncMessages['instanceMessage_' + generalId] === response) {
                return;
            }
            let groupInstancesComments = [];
            if (state.commentInstances.groupCommentsOrder[groupId]) {
                groupInstancesComments = state.commentInstances.groupCommentsOrder[groupId][generalId];
            }
            dispatch({
                type: types.GROUP_INSTANCE_CHAT_SCROLL_UP,
                comments: groupInstancesComments,
                token: token,
                group: {_id: groupId},
                instance: generalId,
            });
            dispatch({
                type: actions.SYNC_MESSAGE,
                id: 'instanceMessage_' + generalId,
                lastMessage: response
            })
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
        let response = snap.val();
        if (response && !response.markAsRead) {
            const token = state.authentication.token;
            if (state.syncServer.syncMessages['user_follow_group_' + groupId] && state.syncServer.syncMessages['user_follow_group_' + groupId] === response) {
                return;
            }
            dispatch({
                type: types.SAVE_GROUPS_REQUEST,
                token: token,
            });
            dispatch({
                type: types.GET_NEXT_GROUPS_FOLLOWERS,
                token: token,
                groupId: groupId,
                skip: 0,
                limit: 0
            });
            dispatch({
                type: actions.SYNC_MESSAGE,
                id: 'user_follow_group_' + groupId,
                lastMessage: response
            })
        }
    })
    //sync group main feeds
    asyncListener.addListener('feed_' + groupId, (snap) => {
        let response = snap.val();
        if (response && !response.markAsRead) {
            const feedOrder = state.groups.groupFeedOrder[groupId];
            const user = state.user.user;
            let group = state.groups.groups[groupId];
            const token = state.authentication.token;
            if (feedOrder) {
                if (state.syncServer.syncMessages['feed_' + groupId] && state.syncServer.syncMessages['feed_' + groupId] === response) {
                    return;
                }
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
                dispatch({
                    type: actions.SYNC_MESSAGE,
                    id: 'feed_' + groupId,
                    lastMessage: response
                })
            }
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
            if (state.syncServer.syncMessages['social_' + entity] && state.syncServer.syncMessages['social_' + entity] === response) {
                return;
            }
            dispatch({
                type: types.FEED_SET_SOCIAL_STATE,
                token: token,
                id: instanceId
            });
            dispatch({
                type: actions.SYNC_MESSAGE,
                id: 'social_' + entity,
                lastMessage: response
            })
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
        }
    })
}

function syncMemberCard(memberCard) {
    let dispatch = store.dispatch;
    let state = store.getState();
    // sync social
    asyncListener.addListener('card_' + memberCard._id, (snap) => {
        let response = snap.val();
        if (response) {
            const token = state.authentication.token;
            dispatch({
                type: types.GET_MY_MEMBER_CARDS,
                token: token,
            });
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
            if (state.syncServer.syncMessages['promotion_' + promotionId] && state.syncServer.syncMessages['promotion_' + promotionId] === response) {
                return;
            }
            const token = state.authentication.token;
            if (!state.businesses.businessesPromotions) {
                return
            }
            let promotions = [];
            Object.keys(state.businesses.businessesPromotions).forEach(bussinesid => {
                promotions.push.apply(promotions, state.businesses.businessesPromotions[bussinesid])
            });
            let promotionsMap = promotions.reduce(function (map, obj) {
                map[obj._id] = obj;
                return map;
            }, {});
            let promotion = promotionsMap[promotionId];
            if (promotion) {
                let businessId = promotion.entity.business._id;
                if (state.businesses.myBusinesses[businessId]) {
                    dispatch({
                        type: types.UPDATE_PROMOTION,
                        token: token,
                        id: promotionId,
                        businessId: businessId,
                        item: promotion
                    });
                    dispatch({
                        type: actions.SYNC_MESSAGE,
                        id: 'promotion_' + promotionId,
                        lastMessage: response
                    })
                }
            }
        }
    })
}

function invokeEntityCommentSendEvent(generalId, message, state, groupId) {
    invokeSyncChat(groupId, generalId, state, message);
    invokeSocialChange(generalId, state);
    asyncListener.syncChange('instanceMessage_' + generalId, message);
}

function invokeEntityCommentDeleteEvent(generalId, messageId) {
    asyncListener.syncChange('deleteMessage_' + generalId, messageId);
}

function invokeSocialChange(generalId, state) {
    asyncListener.syncChange('social_' + generalId, "addComment" + new Date().getTime());
    if (state.instances.instances[generalId] && state.instances.instances[generalId].promotion) {
        asyncListener.syncChange('promotion_' + state.instances.instances[generalId].promotion, 'like' + new Date().getTime());
    }
}

function invokePromotionSocialChange(promotionId) {
    asyncListener.syncChange('promotion_' + promotionId, 'changed' + new Date().getTime());
}

function invokeSyncChat(groupId, generalId, state, message) {
    if (state.instances.instances[generalId] && state.instances.instances[generalId].promotion) {
        asyncListener.syncChange('promotion_' + state.instances.instances[generalId].promotion, 'add-comment' + new Date().getTime());
    }
    if (groupId) {
        asyncListener.syncChange('group_' + groupId, 'addComment' + new Date().getTime())
        asyncListener.syncChange('group_chat_' + groupId, message + new Date().getTime())
    }
}

function invokeSyncChatTyping(groupId, userId, user) {
    asyncListener.syncChangeChild('group_chat_typing_users' + groupId, 'users', userId, user);
}

function invokeAllDone(groups, userId) {
    if (groups) {
        Object.values(groups).forEach(group => {
            asyncListener.syncChange('group_chat_typing_users' + group._id, 'users', userId, 'DONE');
        })
    }
}

export default {
    addGroupChatSync,
    invokeAllDone,
    invokeSyncChatTyping,
    invokeBusinessChange,
    syncMemberCard,
    addChatSync,
    addMyBusinessSync,
    syncGroup,
    syncSocialState,
    syncPromotion,
    invokeEntityCommentSendEvent,
    invokeSocialChange,
    addChatGroupEntitySync,
    invokeSyncChat,
    invokeBusinessPromotionsChange,
    invokeBusinessProductsChange,
    invokeBusinessUserChange,
    invokeEntityCommentDeleteEvent,
    invokePromotionSocialChange
}
