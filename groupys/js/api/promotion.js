/**
 * Created by roilandshut on 26/03/2017.
 */
import store from "react-native-simple-store";
import serverRequestHandler from './serverRequestHandler';

class PromotionApi {
    createPromotion(promotion, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/promotions/campaign`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(promotion)
        }, 'promotions', 'campaign');
    }

    updatePromotion(promotion, id) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/promotions/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(promotion)
        }, 'promotions', 'update campaign');
    }

    async save(id) {
        let token = await store.get('token');
        return serverRequestHandler.fetch_handler(`${server_host}/api/instances/save/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            }
        }, 'instances', 'save');
    }

    realizePromotion(code, token) {
        let date = new Date();
        let time = {};
        time.hours = date.getHours();
        time.day = date.getDay();
        time.minutes = date.getMinutes();
        return serverRequestHandler.fetch_handler(`${server_host}/api/instances/post/realize/${code}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(time)
        }, 'instances', 'post/realize/:code');
    }

    getPromotionInstance(code, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/savedInstances/qrcode/${code}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            },
        }, 'savedInstances', 'qrcode/:code');
    }

    async getPromotionQrcode(id) {
        let token = await store.get('token');
        return serverRequestHandler.fetch_handler(`${server_host}/api/instances/qrcode/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            },
        }, 'instances', 'qrcode/:code');
    }

    //TODO: paginate
    async getAll() {
        let token = await store.get('token');
        return serverRequestHandler.fetch_handler(`${server_host}/api/promotions/list/create/by/user/0/100`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            },
        }, 'promotions', 'list/create/by/user');
    }

    getPromotionById(id, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/promotions/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            },
        }, 'promotions', '/:id');
    }

    //TODO: Paginate
    getAllByBusinessId(id, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/promotions/list/by/business/${id}/start/down`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token
            },
        }, 'promotions', 'list/by/business/:id');
    }
}

export default PromotionApi;