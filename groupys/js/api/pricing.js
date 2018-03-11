import serverRequestHandler from './serverRequestHandler';

class PricingApi {
    checkoutNew(token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/pricings/checkouts/new`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'pricings', '/checkouts/new');
    }

    createBusinessPricing(businessId, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/pricings/create/pricing/${businessId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'pricings', '/create/pricing');
    }

    checkoutId(id, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/pricings/checkouts/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
        }, 'pricings', '/checkouts/id');
    }

    checkoutRequest(request, token) {
        return serverRequestHandler.fetch_handler(`${server_host}/api/pricings/checkouts`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(request)
        }, 'pricings', '/checkouts/create');
    }
}

export default PricingApi;