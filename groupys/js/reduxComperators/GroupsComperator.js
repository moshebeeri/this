import getStore from "../store";

const reduxStore = getStore();

class GroupsComperator {
    shouldUpdateGroups(newgroups) {
        let groups = reduxStore.getState().groups.groups;
        if(Object.keys(groups).length === 0){
            return true;
        }
        let shouldUpdate = false;
        if (newgroups) {
            newgroups.forEach(group => {
                if (!groups[group._id]) {
                    shouldUpdate =  true;
                }else {
                    if (this.shouldUpdateGroup(group, groups[group._id])) {
                        shouldUpdate = true;
                    }
                }
            })
        }
        return shouldUpdate;
    }

    shouldUpdateGroup(group, newGroup) {
        if (group.add_policy !== newGroup.add_policy) {
            return true;
        }
        if (group.description !== newGroup.description) {
            return true;
        }
        if (group.entity_type !== newGroup.entity_type) {
            return true;
        }
        if (group.name !== newGroup.name) {
            return true;
        }
        if (group.post_policy !== newGroup.post_policy) {
            return true;
        }
        if (newGroup.preview) {
            if (!group.preview) {
                return true;
            }
            if (newGroup.preview.comment) {
                if (!group.preview.comment) {
                    return true;
                }
                if (newGroup.preview.comment.created !== group.preview.comment.created) {
                    return true;
                }
            }
            if (newGroup.preview.post) {
                if (!group.preview.post) {
                    return true;
                }
                if (newGroup.preview.post.created !== group.preview.post.created) {
                    return true;
                }
            }
            if (newGroup.preview.instance_activity) {
                if (!group.preview.instance_activity) {
                    return true;
                }
                if (newGroup.preview.instance_activity.timestamp !== group.preview.instance_activity.timestamp) {
                    return true;
                }
            }
        }
        if (newGroup.touched !== group.touched) {
            return true;
        }
        if (newGroup.social_state) {
            if (!group.social_state) {
                return true;
            }
            if (newGroup.social_state.comments !== group.social_state.comments) {
                return true;
            }
            if (newGroup.social_state.follow !== group.social_state.follow) {
                return true;
            }
            if (newGroup.social_state.followers !== group.social_state.followers) {
                return true;
            }
            if (newGroup.social_state.like !== group.social_state.like) {
                return true;
            }
            if (newGroup.social_state.likes !== group.social_state.likes) {
                return true;
            }
            if (newGroup.social_state.share !== group.social_state.share) {
                return true;
            }
            if (newGroup.social_state.shares !== group.social_state.shares) {
                return true;
            }
        }
        return false;
    }
}

export default GroupsComperator;