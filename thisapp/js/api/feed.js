import serverRequestHandler from './serverRequestHandler';

class FeedApi {
    getAll(direction, id, token, entity) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/feeds/${id}/${direction}/${entity._id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            }
        }, 'feeds', '/get');
    }

    get(id,token){
        return serverRequestHandler.fetch_handler(`${server_host}/api/feeds/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            }
        }, 'feeds', '/get');
    }

    getFeedSocialState(id, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/feeds/social_state/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            }
        }, 'feeds', '/social_state');
    }
}

export default FeedApi;