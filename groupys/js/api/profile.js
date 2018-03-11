import serverRequestHandler from './serverRequestHandler';

class ProfileApi {
    fetch(token, from, to) {
        return serverRequestHandler.fetch_handler(`${server_host}//api/profiles/instances/saved/${from}/${to}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'profiles', '/instances/saved');
    }

    getSavedInstance(token, id) {
        return serverRequestHandler.fetch_handler(`${server_host}//api/savedInstances/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'savedInstances', 'get');
    }
}

export default ProfileApi;