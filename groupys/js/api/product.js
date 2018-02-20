import Timer from './LogTimer'
import * as errors from './Errors'
import FormUtils from "../utils/fromUtils";
import ProductComperator from "../reduxComperators/ProductComperator"

let timer = new Timer();
let productComperator = new ProductComperator();

class ProductsApi {
    getAll(token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/products/0/10`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (response.status === '401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'products', '/');
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    findByBusinessId(id, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/products/entity/scroll/${id}` + '/start/down', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (response.status === '401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                if (response.status > 400) {
                    reject(errors.APPLICATION_ERROR);
                }
                timer.logTime(from, new Date(), 'products', 'find/by/business');
                let responseData = await response.json();
                if (responseData.length > 0) {
                    responseData = responseData.filter(product => productComperator.filterProduct(product));
                }
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    getProductCategories(gid, token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                let locale = FormUtils.getLocale();
                const response = await fetch(`${server_host}/api/categories/product/` + locale + '/' + gid, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    }
                })
                if (response.status === '401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                timer.logTime(from, new Date(), 'categories', 'product/en')
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }
}
let productApi = new ProductsApi();
export default productApi;