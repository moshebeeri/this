/**
 * Created by roilandshut on 26/03/2017.
 */
/**
 * Created by roilandshut on 26/03/2017.
 */
import store from 'react-native-simple-store';

import EntityUtils from "../utils/createEntity";

let entityUtils = new EntityUtils();
class PromotionApi
{
    createPromotion(promotion,callbackFunction) {
        return new Promise(async(resolve, reject) => {

            try {
                let token = await store.get('token');
                let userId = await store.get('user_id');
                const response = await fetch(`${server_host}/api/promotions/campaign`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    },
                    body: JSON.stringify(promotion)

                })
                if (response.status == '401') {
                    reject(response);
                    return;
                }

                let responseData = await response.json();

                if(promotion.image){
                    entityUtils.doUpload(promotion.image.uri,promotion.image.mime,token,callbackFunction,'promotions',responseData.promotions[0]);

                }else{
                    callbackFunction(responseData);
                }


                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ');
                reject('failed');
            }
        })


    }

    updatePromotion(promotion,callbackFunction,id) {
        return new Promise(async(resolve, reject) => {

            try {
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/promotions/`+id, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    },
                    body: JSON.stringify(promotion)

                })
                if (response.status == '401') {
                    reject(response);
                    return;
                }

                let responseData = await response.json();


                callbackFunction(responseData);
                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ');
                reject('failed');
            }
        })


    }

    save(id){
        return new Promise(async(resolve, reject) => {

            try {
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/instances/save/`+ id, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    }

                })
                if (response.status == '401') {
                    reject(response);
                    return;
                }

                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ');
                reject('failed');
            }
        })



    }

    realizePromotion(code){
        return new Promise(async(resolve, reject) => {

            try {
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/instances/realize/`+code, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    }

                })
                if (response.status == '401') {
                    reject(response);
                    return;
                }

                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ');
                reject('failed');
            }
        })



    }

    getPromotionQrcode(id){
        return new Promise(async(resolve, reject) => {

            try {
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/instances/qrcode/`+id, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    }

                })
                if (response.status == '401') {
                    reject(response);
                    return;
                }

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
        return new Promise(async(resolve, reject) => {

            try {
                let token = await store.get('token');
                 const response = await fetch(`${server_host}/api/promotions/list/create/by/user/0/100`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    }

                })
                if (response.status == '401') {
                    reject(response);
                    return;
                }

                let responseData = await response.json();
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