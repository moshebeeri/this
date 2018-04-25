import serverRequestHandler from './serverRequestHandler';

class GroupsApi {
    createGroup(group, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/groups/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(group)
        }, 'groups', '/create');
    }

    updateGroup(group, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/groups/${group._id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(group)
        }, 'groups', '/update');
    }

    addUserToGroup(user, group, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/groups/add/user/${user}/${group}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'groups', '/groups/add/user');
    }

    inviteUser(user, group,token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/groups/invite/ask/${group}/${user}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'groups', '/groups/add/user');
    }

    acceptInvitation(group, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/groups/invite/approve/${group._id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'groups', '/groups/add/user', 'BOOLEAN');
    }

    getAll(token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/groups/user/follow/0/100`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'groups', 'user/follow');
    }

    get(token, groupId) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/groups/${groupId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'groups', '/get');
    }

    getByBusinessId(bid, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/groups/following/${bid}/0/100`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'groups', '/following');
    }

    touch(groupid, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/groups/touch/${groupid}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'groups', '/following', 'BOOLEAN');
    }

    join(groupid, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/groups/join/${groupid}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'groups', '/join');
    }

    meesage(groupid, message, token) {
        let json = {
            message: message
        };
        return serverRequestHandler.fetch_handler(`${server_host}/api/groups/message/${groupid}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(json)
        }, 'groups', '/join');
    }

    searchGroup(search, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/groups/search/0/100/${search}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'groups', '/search');
    }
}

export default GroupsApi;