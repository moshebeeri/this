import store from 'react-native-simple-store';


class LoginUtils {

    login(email, password) {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await fetch(`${server_host}/auth/local`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, *!/!*',
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    })
                });
                const responseData = await response.json();
                await store.save('token', responseData.token);
                const _id = await this.getUser(responseData.token);
                resolve(_id);
            }
            catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        });
    }

    stringToMail(normalizedPhone) {
        return normalizedPhone+`@${DOMAIN}`
    }

    signup(countryCode, mobile, email, password) {
        return new Promise(async(resolve, reject) => {
            try {
                console.log(`${server_host}/api/users`);
                let body = {
                    country_code: countryCode,
                    phone_number: mobile,
                    email: email,
                    password: password,
                };
                console.log(JSON.stringify(body));
                const response = await fetch(`${REST_API}/users`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify(body)
                });
                const responseData = await response.json();
                await store.save('token', responseData.token);
                resolve(responseData.token);

            } catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error)
            }
        });
    }



    getUser(token) {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await fetch(`${server_host}/api/users/me/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    }
                });
                const responseData = await response.json();
                console.log(JSON.stringify(responseData));
                await store.save('user_id', responseData._id);
                console.log('user_id: '+ responseData._id);
                resolve(responseData._id);

            } catch (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                reject(error);
            }
        });
    }

    getToken() {
        return new Promise(async(resolve, reject) => {
            try {
                const token = await store.get('token');
                if(!token)
                    reject(null);
                const me = await fetch(`${server_host}/api/users/me/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    }
                });
                if(me.status === 401) {
                    console.log('token expired');
                    try{
                        const token = await this.refreshToken();
                        resolve(token);
                    }catch (error) {
                        reject(error);
                    }
                }
                resolve(token);
            } catch (error) {
                reject(error);
            }
        });

    }

    async refreshToken() {
        return new Promise(async(resolve, reject) => {
            try {
                    reject('login')
            }catch(error){
                console.log(error);
                reject(error)
            }
        });
    }

    reset_credentials() {
        store.delete('isAnonymous');
        store.delete('credentials');
        store.delete('user_id');
        store.delete('token');
        store.delete('privateKey');
        store.delete('recover_account');
    }
}
export default LoginUtils;
