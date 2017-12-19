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
                if (response.status ==='401') {
                    reject(response);
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
                console.log('There has been a problem with your fetch operation: ');
                reject('failed');
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
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), 'promotions', 'update');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ');
                reject('failed');
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
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), 'instances', 'save');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ');
                reject('failed');
            }
        })
    }

    realizePromotion(code,token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/instances/realize/` + code, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), 'instances', 'realize');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ');
                reject('failed');
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
                if (response.status === 401) {
                    reject(response);
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
                console.log('There has been a problem with your fetch operation: ');
                reject('failed');
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
                if (response.status === 401) {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), 'instances', 'qrcode');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ');
                reject('failed');
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
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), 'promotions', 'list/create/by/user');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
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
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), 'promotions', 'id');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
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
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'promotions', 'list/by/business');
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })
    }
}

export default PromotionApi;