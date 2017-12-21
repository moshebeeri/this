import Timer from "./LogTimer";

let timer = new Timer();
import FormUtils from "../utils/fromUtils";
class BusinessApi {
    getAll(token) {
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
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                let responseData = await response.json();

                responseData =  await Promise.all(responseData.map(async (item) => {
                    item.categoryTitle = await this.getSubCategory(token,item.business.subcategory);
                    return item;
                }));

                timer.logTime(from, new Date(), 'businesses', 'list/mine');
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
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
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                let responseData = await response.json();


                timer.logTime(from, new Date(), 'businesses', 'list/mine');
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })
    }

    getSubCategory(token,categoryId) {
        return new Promise(async (resolve, reject) => {
            try {
                let locale = FormUtils.getLocale();

                let from = new Date();
                const response = await fetch(`${server_host}/api/categories/by/id/`+locale+'/'+ categoryId, {
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
                timer.logTime(from, new Date(), 'businesses', 'list/mine');
                resolve(responseData[0].translations.en);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
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
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), 'categories', 'business/en');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
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
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), '/businesses/search', 'business/en');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
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
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), '/businesses/search', 'business/en');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
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
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), '/groups/', 'follow');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ');
                reject(error);
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
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
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
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), '/businesses/search', 'business/en');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
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
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), '/businesses/search', 'business/en');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
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
                if (response.status ===401) {
                    reject(response);
                    return;
                }
                timer.logTime(from, new Date(), '/api/qrcodes/', 'image/code/');
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject('failed');
            }
        })
    }
}

export default BusinessApi;