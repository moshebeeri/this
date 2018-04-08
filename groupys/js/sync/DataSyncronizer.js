import getStore from "../store";
import asyncListener from "../api/AsyncListeners";
import * as types from '../sega/segaActions';
const store = getStore();

class DataSync {
    syncData() {
        //sync group chats
        this.syncGroupChat(store.getState().groups.groups, store.getState(), store.dispatch);
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