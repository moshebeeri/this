/**
 * Created by roilandshut on 26/03/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */
import store from "react-native-simple-store";
import EntityUtils from "../utils/createEntity";
import Timer from "./LogTimer";

let entityUtils = new EntityUtils();
let timer = new Timer();
import * as errors from './Errors'
class PromotionApi {
    createPromotion(promotion, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/promotions/campaign`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(promotion)
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'promotions', 'campaign');
                if (promotion.image) {
                    let imagePath = promotion.image.uri;
                    if(!imagePath){
                        imagePath = promotion.image.path;
                    }
                    entityUtils.doUpload(imagePath, promotion.image.mime, token, this.doLog.bind(this), 'promotions', responseData.promotions[0]);
                }
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    doLog(){

    }

    updatePromotion(promotion, id) {
        return new Promise(async (resolve, reject) => {
            try {
                let token = await store.get('token');
                let from = new Date();
                const response = await fetch(`${server_host}/api/promotions/` + id, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(promotion)
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                timer.logTime(from, new Date(), 'promotions', 'update');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    save(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/instances/save/` + id, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                timer.logTime(from, new Date(), 'instances', 'save');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    realizePromotion(code,token) {
        return new Promise(async (resolve, reject) => {
            try {
                let date = new Date();
                let time = {};
                time.hours = date.getHours();
                time.day = date.getDay();
                time.minutes = date.getMinutes()
                let from = new Date();
                const response = await fetch(`${server_host}/api/instances/post/realize/` + code, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(time)
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                timer.logTime(from, new Date(), 'instances', 'realize');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }


    getPromotionInstance(code,token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/savedInstances/qrcode/` + code, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                });
                console.log('after call')
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }

                if (response.status ==='404' || response.status === 404) {
                    reject(errors.REALIZATIOn_NOT_ALLOWED);
                    return;
                }
                console.log('check status ')
             //   timer.logTime(from, new Date(), 'instances', 'realize');
                try {
                    let responseData = await response.json();
                    resolve(responseData);
                }catch (error){
                    console.log(error);
                    reject(response);
                }


            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }
    getPromotionQrcode(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/instances/qrcode/` + id, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (response.status ==='404' || response.status === 404) {
                    reject('invalid code')

                }
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                timer.logTime(from, new Date(), 'instances', 'qrcode');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    getAll() {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/promotions/list/create/by/user/0/100`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                timer.logTime(from, new Date(), 'promotions', 'list/create/by/user');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    getPromotionById(id,token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();

                const response = await fetch(`${server_host}/api/promotions/` + id, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                timer.logTime(from, new Date(), 'promotions', 'id');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    getAllByBusinessId(id, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/promotions/list/by/business/` + id, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'promotions', 'list/by/business');
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }
}

export default PromotionApi;