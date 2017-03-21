import store from 'react-native-simple-store';

class ProductsApi
{
    getAll() {
        return new Promise(async(resolve, reject) => {

            try {
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/products`, {
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
    findByBusinessId(id){
        return new Promise(async(resolve, reject) => {

            try {
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/products/`, {
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
        })    }
}

export default ProductsApi;