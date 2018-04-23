import asyncListener from "../api/AsyncListeners";
import * as types from '../sega/segaActions';



function addMyBusinessSync(dispatch,state,businessId){

    asyncListener.addListener("business_" + businessId, (snap) => {
        let response = snap.val();
        if(response) {
            const token = state.authentication.token;
            dispatch({
                type: types.UPDATE_BUSINESS_REQUEST,
                token: token,
            })
        }

    });


}
function addBusinessSync(dispatch,state,businessId){


    asyncListener.addListener('social_' + businessId, (snap) => {
        let response = snap.val();
        if (response && !response.markAsRead) {
            let businessId = snap.key.substring('social_'.length);
            const token = state.authentication.token;

            dispatch({
                type: types.FEED_SET_SOCIAL_STATE,
                token: token,
                id: businessId
            });
            asyncListener.markAsRead(snap.key);
        }
    })

}

function addGroupChatSync(dispatch,state,groupId){

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



function addInstanceChatSync(dispatch,state,instanceId){
    asyncListener.addListener('instanceMessage_' +instanceId, (snap) => {
        let response = snap.val();
        if (response && !response.markAsRead) {
            let instanceId = snap.key.substring('instanceMessage_'.length);
            const token = state.authentication.token;
            let entities = [];
            entities.push({instance: instanceId});
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
            asyncListener.markAsRead(snap.key);
        }

    })
}



export default {
    addGroupChatSync,
    addInstanceChatSync,
    addBusinessSync,
    addMyBusinessSync
}
