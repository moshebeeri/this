import serverRequestHandler from './serverRequestHandler';

class InstanceApi {
    getInstance(token, instanceId) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/instances/${instanceId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'instances', '/get');
    }
}

export default InstanceApi;