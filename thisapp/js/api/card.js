import FormUtils from "../utils/fromUtils";
import serverRequestHandler from './serverRequestHandler';

class CardApi {
    getAll(token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/cards/0/10`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'products', '/getAll');
    }

    createCardType(card, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/cardTypes`, {
            method: 'POST',
            headers: {
                    'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(card)
        }, 'products', '/create');
    }


    // updateProduct(product, token) {
    //     return serverRequestHandler.fetch_handler(`${server_host}/api/products/${product._id}`, {
    //         method: 'PUT',
    //         headers: {
    //             'Accept': 'application/json, text/plain, */*',
    //             'Content-Type': 'application/json;charset=utf-8',
    //             'Authorization': 'Bearer ' + token,
    //         },
    //         body: JSON.stringify(product)
    //     }, 'products', '/update');
    // }




}

let cardApi = new CardApi();
export default cardApi;