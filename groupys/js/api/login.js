import store from "react-native-simple-store";
import * as errors from './Errors'
class LoginApi {
    clean_phone_number(number) {
        // remove all non digits, and then remove 0 if it is the first digit
        return number.replace(/\D/g, '').replace(/^0/, '')
    };

    login(phoneNumber, password) {
        let normalizePhoneNumber = this.clean_phone_number(phoneNumber);
        let email = '972' + normalizePhoneNumber + "@low.la";
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${server_host}/auth/local`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    })
                });
                if (response.status ==='401') {
                    resolve({});
                    return;
                }
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    normalizePhoneNumber(phone, countryCode) {
        let newPhone = phone.toString().substring(phone.indexOf(countryCode.toString()) + countryCode.toString().length);
        return newPhone;
    }

    signup(phone, password, firstName, lastName) {
        let phoneNumber = '+972' + phone;
        let normalizedPhone = this.normalizePhoneNumber(phoneNumber, '+972');
        let cleanPhone = this.clean_phone_number(normalizedPhone);
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${server_host}/api/users`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({
                        country_code: '+972',
                        name: firstName + ' ' + lastName,
                        phone_number: cleanPhone,
                        email: '972' + cleanPhone + "@low.la",
                        password: password,
                    })
                });
                if (response.status === '401') {
                    reject(errors.SIGNUP_FAILED);
                    return;
                }
                let responseData = await response.json();
                store.save('token', responseData.token);
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    verifyCode(code) {
        return new Promise(async (resolve, reject) => {
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

                if(response.status ==='200' || response.status === 200 ) {
                    let result = {
                        token: token
                    };
                    resolve(result);
                    return;
                }

                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }

                reject(errors.FAILED_SMS_VALIDATION);

            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    recoverPassword(phoneNumber) {
        let normalizedPhone = this.clean_phone_number(phoneNumber);
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${server_host}/api/users/password/` + normalizedPhone, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                    }
                });
                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }
                let responseData = await response.json();
                resolve(responseData);
            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }

    changePassword(oldPassword, newPassowrd, userId, token) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${server_host}/api/users/` + userId + `/password/`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + token,
                    },
                    body: JSON.stringify({
                        oldPassword: oldPassword,
                        newPassword: newPassowrd,
                    })
                });

                if (response.status ==='401' || response.status === 401) {
                    reject(errors.UN_AUTHOTIZED_ACCESS);
                    return;
                }

                if (response.status === 200) {
                    resolve({response: true});
                    return;
                }


                reject(errors.PASSOWRD_VALIDATION_FAILED);

            }
            catch (error) {
                reject(errors.NETWORK_ERROR);
            }
        })
    }
}

export default LoginApi;
