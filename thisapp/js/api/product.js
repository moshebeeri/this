import FormUtils from "../utils/fromUtils";
import serverRequestHandler from './serverRequestHandler';

class ProductsApi {
    getAll(token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/products/0/10`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'products', '/getAll');
    }

    createProduct(product, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/products`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(product)
        }, 'products', '/create');
    }


   updateProduct(product, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/products/${product._id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(product)
        }, 'products', '/update');
    }


   deleteProduct(product, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/products/${product._id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'products', '/delete');
    }

    findByBusinessId(id, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/products/entity/scroll/${id}/start/down`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'products', '/entity/scroll');
    }

    getProductCategories(gid, token) {
        let locale = FormUtils.getLocale();
        return serverRequestHandler.fetch_handler(`${server_host}/api/categories/product/${locale}/${gid}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'products', 'categories/product');
    }
}

let productApi = new ProductsApi();
export default productApi;