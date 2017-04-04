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
                        email:  phoneNumber + "@low.la",
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
}

export default LoginApi;
