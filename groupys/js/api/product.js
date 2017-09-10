import store from 'react-native-simple-store';
import Timer from './LogTimer'

let timer = new Timer();
class ProductsApi
{
    getAll(token) {
        return new Promise(async(resolve, reject) => {

            try {
                let from = new Date();

                const response = await fetch(`${server_host}/api/products/0/10`, {
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
                timer.logTime(from,new Date(),'products','/')

                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })


    }
    findByBusinessId(id,token){
        return new Promise(async(resolve, reject) => {

            try {
                let from = new Date();


                const response = await fetch(`${server_host}/api/products/find/by/business/${id}`, {
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
                timer.logTime(from,new Date(),'products','find/by/business')

                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ');
                reject(error);
            }
        })    }



    getProductCategories(gid,token)
    {

        return new Promise(async(resolve, reject) => {

            try {
                let from = new Date();

                const response = await fetch(`${server_host}/api/categories/product/en/` +gid, {
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
                timer.logTime(from,new Date(),'categories','product/en')

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


export default ProductsApi;