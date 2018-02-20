import Timer from "./LogTimer";
import * as errors from './Errors'
let timer = new Timer();
import FormUtils from "../utils/fromUtils";
import PhoneUtils from "../utils/phoneUtils";
class BusinessApi {

     timeout(ms, promise) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                reject(errors.TIME_OUT);
            }, ms);
            promise.then(resolve, reject)
        })
    }

    getAll(token,noSideEffects) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/businesses/list/mine`, {
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

                if(noSideEffects){
                    resolve(responseData);
                    return;
                }
                responseData =  await Promise.all(responseData.map(async (item) => {

                    item.categoryTitle = await this.getSubCategory(token,item.business.subcategory);
                    return item;
                }));

                timer.logTime(from, new Date(), 'businesses', 'list/mine');
                resolve(responseData);
            }
            catch (error) {
                if(error === errors.TIME_OUT){
                    reject({ type: errors.TIME_OUT, debugMessage:'api/businesses/list/mine Timed out'});
                }
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    get(token,id) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/businesses/` +id, {
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


                timer.logTime(from, new Date(), 'businesses', 'list/mine');
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    getSubCategory(token,categoryId,locale) {
        return new Promise(async (resolve, reject) => {
            try {

                let from = new Date();
                const response = await fetch(`${server_host}/api/categories/by/id/`+locale+'/'+ categoryId, {
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
                timer.logTime(from, new Date(), 'businesses', 'list/mine');
                resolve(responseData[0].translations.en);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }


    getBusinessCategories(gid, token) {
        return new Promise(async (resolve, reject) => {
            let locale = FormUtils.getLocale();

            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/categories/business/`+ locale + '/'  +  gid, {
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
                timer.logTime(from, new Date(), 'categories', 'business/en');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    followBusiness(businessId, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/businesses/follow/` + businessId, {
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
                timer.logTime(from, new Date(), '/businesses/search', 'business/en');
                resolve(true);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }
    unFollowBusiness(businessId, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/users/follow/` + businessId, {
                    method: 'DELETE',
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
                timer.logTime(from, new Date(), '/businesses/search', 'business/en');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    groupFollowBusiness(groupId,businessId, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/groups/follow/` + groupId+'/'+ businessId, {
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
                timer.logTime(from, new Date(), '/groups/', 'follow');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    checkAddress(businesses, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/businesses/checkAddress/`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(businesses)
                });

                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }

                if (parseInt(response.status) >= 400) {
                    let response = {
                        message: 'Address not found',
                        valid: false
                    };
                    resolve(response);
                    return;
                }
                timer.logTime(from, new Date(), '/businesses/', 'checkAddress');
                let responseData = await response.json();
                responseData.valid = true;
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    searchBusiness(search, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/businesses/search/0/100/` + search, {
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
                timer.logTime(from, new Date(), '/businesses/search', 'business/en');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    searchBusinessByCode(qrCode, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/qrcodes/find/` + qrCode, {
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
                timer.logTime(from, new Date(), '/businesses/search', 'business/en');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    assihgnQrcCodeToBusinese(qrCode, token,business) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                let requset = {
                    assignment: {business: business},
                    type:'FOLLOW_BUSINESS',
                    action:'FOLLOW'

                }
                const response = await fetch(`${server_host}/api/qrcodes/assign/` + qrCode.code, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(requset)
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                timer.logTime(from, new Date(), '/businesses/search', 'business/en');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    getBusinessQrCodeImage(qrCode, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/qrcodes/image/id/` + qrCode, {
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
                timer.logTime(from, new Date(), '/api/qrcodes/', 'image/code/');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    getUserBusinessesByPhoneNumber(phone,token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                let phoneNumber = PhoneUtils.clean_phone_number(phone);
                const response = await fetch(`${server_host}/api/businesses/user/businesses/by/phone/` + 972 + '/' + phoneNumber, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token,
                    }
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                let responseData = await response.json();
                resolve(responseData);
                timer.logTime(from, new Date(), 'businesses', 'user/businesses/by/phone/')
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }
}

export default BusinessApi;