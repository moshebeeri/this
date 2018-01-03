import Timer from "./LogTimer";

let timer = new Timer();

class PricingApi {
    checkoutNew( token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/pricings/checkouts/new`,  {
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
                timer.logTime(from, new Date(), 'pricing', 'ricing/checkouts/new');
                resolve(responseData);
            }
            catch (error) {
                reject(error);
            }
        })
    }
    checkoutId(id ,token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/pricings/checkouts/` + id,  {
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
                timer.logTime(from, new Date(), 'pricing', 'ricing/checkouts/id');
                resolve(responseData);
            }
            catch (error) {
                reject(error);
            }
        })
    }

    checkoutRequest(request ,token) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = new Date();
                const response = await fetch(`${server_host}/api/pricings/checkouts/`,  {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(request)
                });
                if (response.status ==='401') {
                    reject(response);
                    return;
                }
                let responseData = await response.json();
                timer.logTime(from, new Date(), 'pricing', 'ricing/checkouts');
                resolve(responseData);
            }
            catch (error) {
                reject(error);
            }
        })
    }


}

export default PricingApi;