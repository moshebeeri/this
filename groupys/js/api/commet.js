import serverRequestHandler from './serverRequestHandler';
import asyncListener from "../api/AsyncListeners";

class CommentApi {
    createComment(group, instance, comment, token) {

        let request = {
            entities: [
                {group: group},
                {instance: instance},
                {post: instance},
            ]
            ,
            message: comment
        };
        return serverRequestHandler.fetch_handler(`${server_host}/api/comments/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(request)
        }, 'comments', '/create');
    }

    createGlobalComment(entities, comment, token) {
        let request = {
            message: comment
        };
        request.entities = entities;
        return serverRequestHandler.fetch_handler(`${server_host}/api/comments/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(request)
        }, 'comments', '/create');
    }

    getComment(entities, token, skip) {
        let request = {};
        request.entities = entities;
        return serverRequestHandler.fetch_handler(`${server_host}/api/comments/find/${find}/10`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(request)
        }, 'comments', '/find/skip/limit');
    }

    getFeedComments(entities, token, id, direction) {
        let request = {};
        request.entities = entities;
        return serverRequestHandler.fetch_handler(`${server_host}/api/comments/find/scroll/${id}/${direction}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(request)
        }, 'comments', '/find/scroll');
    }

    getGroupComments(group, token, id, direction) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/comments/group/chat/scroll/${group._id}/${id}/${direction}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            }
        }, 'comments', 'api/comments/group/chat');
    }

    getInstanceGroupComments(group, instance, token, id, direction) {
        let instanceId = instance._id;
        if (!instanceId) {
            instanceId = instance.id;
        }
        let request = {
            entities: [
                {group: group._id},
                {instance: instanceId},
            ]
        };
        return serverRequestHandler.fetch_handler(`${server_host}/api/comments/find/scroll/${id}/${direction}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(request)
        }, 'comments', 'find/scroll');
    }
}

export default CommentApi;