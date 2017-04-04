import store from 'react-native-simple-store';

class LoginApi
{
    login(phoneNumber, password) {
        return new Promise(async(resolve, reject) => {
            try {

                const response = await fetch(`${server_host}/auth/local`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({
                        email:  phoneNumber + "@lowla.co.il",
                        password:password,
                    })
                })
                if (response.status == '401') {
                    reject({error: 'Login Failed Validation'});
                    return;
                }

                let responseData = await response.json();
                store.save('token', responseData.token);
                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject({error: 'Login Failed '});
            }
        })


    }

    signup(phoneNumber,normalizedPhone, password,callingCode) {
        return new Promise(async(resolve, reject) => {
            try {

                const response = await fetch(`${server_host}/api/users`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({
                        country_code: callingCode,
                        phone_number: normalizedPhone,
                        email: phoneNumber + "@lowla.co.il",
                        password: password,


                    })
                });
                if (response.status == '401') {
                    reject({error: 'Signup Failed Validation'});
                    return;
                }

                let responseData = await response.json();
                store.save('token', responseData.token);
                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject({error: 'signup Failed '});
            }
        })


    }

    verifyCode(code) {
        return new Promise(async(resolve, reject) => {
            try {
                let token = await store.get('token');

                const response = await fetch(`${server_host}/api/users/verification/` + code, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token,
                    }

                });

                if (response.status == '401') {
                    reject({error: 'Signup Failed Validation'});
                    return;
                }

                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {

                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject({error: 'signup Failed '});
            }
        })


    }
}

export default LoginApi;