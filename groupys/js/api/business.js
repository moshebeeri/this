import store from 'react-native-simple-store';

import Timer from './LogTimer'

let timer = new Timer();
class BusinessApi
{
   getAll() {
        return new Promise(async(resolve, reject) => {

            try {
                let from = new Date();
                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/businesses/list/mine`, {
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
                timer.logTime(from,new Date(),'businesses','list/mine')
                resolve(responseData);


            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })


    }




    getBusinessCategories(gid)
    {

        return new Promise(async(resolve, reject) => {

            try {
                let from = new Date();

                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/categories/business/en/` +gid, {
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
                timer.logTime(from,new Date(),'categories','business/en')

                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })

    }

    followBusiness(businessId){
        return new Promise(async(resolve, reject) => {

            try {
            let from = new Date();

            let token = await store.get('token');
            const response = await fetch(`${server_host}/api/businesses/follow/` +businessId, {
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
            timer.logTime(from,new Date(),'/businesses/search','business/en')

            let responseData = await response.json();
            resolve(responseData);
        }
        catch (error) {

            console.log('There has been a problem with your fetch operation: ' + error.message);
            reject(error);
        }
    })
    }

    checkAddress(bussiness){
        return new Promise(async(resolve, reject) => {

            try {
                let from = new Date();

                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/businesses/checkAddress/`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token

                    },
                    body: JSON.stringify(bussiness)

                })

                if (parseInt(response.status) >= 400) {
                    let response = {message:'Address not found',
                                    valid:false}
                    resolve(response);
                    return;
                }


                timer.logTime(from,new Date(),'/businesses/','checkAddress')

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


    searchBusiness(search)
    {

        return new Promise(async(resolve, reject) => {

            try {
                let from = new Date();

                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/businesses/search/0/100/` +search, {
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
                timer.logTime(from,new Date(),'/businesses/search','business/en')

                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        })

    }

    searchBusinessByCode(qrCode)
    {

        return new Promise(async(resolve, reject) => {

            try {
                let from = new Date();

                let token = await store.get('token');
                const response = await fetch(`${server_host}/api/qrcodes/find/` +qrCode, {
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
                timer.logTime(from,new Date(),'/businesses/search','business/en')

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

export default BusinessApi;